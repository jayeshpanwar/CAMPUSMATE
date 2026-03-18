import logging
import numpy as np
from PIL import Image
import io
import pickle

logger = logging.getLogger(__name__)

try:
    import face_recognition
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False
    logger.warning("face-recognition library not installed. Install with: pip install face-recognition")


class FacialRecognitionService:
    """Service for face recognition operations using face-recognition library"""
    
    TOLERANCE = 0.6  # How much distance between faces to consider a match (lower = stricter)
    
    def __init__(self):
        self.tolerance = self.TOLERANCE
        
    def load_image(self, image_file):
        """Load and convert image file to numpy array for processing"""
        try:
            if isinstance(image_file, str):
                # File path
                image = face_recognition.load_image_file(image_file)
            else:
                # File object/upload
                img = Image.open(image_file)
                image = np.array(img)
            return image
        except Exception as e:
            logger.error(f"Error loading image: {str(e)}")
            raise
    
    def extract_face_encoding(self, image):
        """Extract face encoding from an image"""
        try:
            # Get face locations
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                return None, 0
            
            # Get encodings for all faces
            encodings = face_recognition.face_encodings(image, face_locations)
            
            if encodings:
                return encodings[0], 1  # Return first face encoding and count
            
            return None, len(face_locations)
        except Exception as e:
            logger.error(f"Error extracting face encoding: {str(e)}")
            return None, 0
    
    def compare_faces(self, known_encoding, unknown_encoding):
        """Compare two face encodings and return if they match"""
        try:
            if known_encoding is None or unknown_encoding is None:
                return False, 0.0
            
            distance = face_recognition.face_distance([known_encoding], unknown_encoding)
            
            if len(distance) == 0:
                return False, 0.0
            
            match = distance[0] <= self.tolerance
            confidence = 1.0 - float(distance[0])  # Convert distance to confidence score
            
            return match, confidence
        except Exception as e:
            logger.error(f"Error comparing faces: {str(e)}")
            return False, 0.0
    
    def recognize_faces_in_image(self, image, known_profiles):
        """
        Recognize faces in an image against known profiles
        
        Args:
            image: numpy array of image
            known_profiles: List of dict with 'student_id', 'encoding', 'name'
        
        Returns:
            List of recognized students with confidence scores
        """
        recognized = []
        
        try:
            # Get face locations and encodings from unknown image
            face_locations = face_recognition.face_locations(image)
            unknown_encodings = face_recognition.face_encodings(image, face_locations)
            
            if not unknown_encodings:
                return recognized
            
            # Prepare known encodings
            known_encodings = []
            valid_profiles = []
            
            for profile in known_profiles:
                if profile.get('encoding'):
                    try:
                        # Encoding might be stored as binary
                        enc = profile['encoding']
                        if isinstance(enc, bytes):
                            enc = pickle.loads(enc)
                        known_encodings.append(enc)
                        valid_profiles.append(profile)
                    except Exception as e:
                        logger.warning(f"Error loading encoding for {profile.get('student_id')}: {e}")
                        continue
            
            if not known_encodings:
                logger.warning("No valid known profiles available")
                return recognized
            
            # Compare each unknown face with known faces
            for unknown_encoding in unknown_encodings:
                distances = face_recognition.face_distance(known_encodings, unknown_encoding)
                
                best_match_idx = np.argmin(distances)
                best_distance = distances[best_match_idx]
                
                if best_distance <= self.tolerance:
                    profile = valid_profiles[best_match_idx]
                    confidence = 1.0 - float(best_distance)
                    
                    recognized.append({
                        'student_id': profile.get('student_id'),
                        'name': profile.get('name'),
                        'email': profile.get('email'),
                        'confidence': confidence,
                        'matched': True
                    })
                else:
                    recognized.append({
                        'name': 'Unknown',
                        'confidence': 1.0 - float(best_distance),
                        'matched': False
                    })
            
            return recognized
        except Exception as e:
            logger.error(f"Error recognizing faces: {str(e)}")
            return recognized
    
    def process_session_images(self, session, known_profiles):
        """
        Process all images for an attendance session
        
        Args:
            session: AttendanceSession instance
            known_profiles: List of known face profiles
        
        Returns:
            List of attendance records with recognized students
        """
        attendance_data = []
        
        try:
            images = session.images.all()
            
            for session_image in images:
                try:
                    image = self.load_image(session_image.image)
                    recognized_students = self.recognize_faces_in_image(image, known_profiles)
                    
                    for student_data in recognized_students:
                        if student_data.get('matched'):
                            attendance_data.append({
                                'student_id': student_data['student_id'],
                                'name': student_data['name'],
                                'email': student_data['email'],
                                'confidence': student_data['confidence'],
                                'detection_source': 'facial_recognition',
                                'session_image_id': session_image.id
                            })
                except Exception as e:
                    logger.error(f"Error processing image {session_image.id}: {e}")
                    continue
            
            return attendance_data
        except Exception as e:
            logger.error(f"Error processing session images: {str(e)}")
            return attendance_data
