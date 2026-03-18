import React, { useState, useEffect } from 'react';
import { courseApi, sessionApi, recordApi, profileApi } from './attendanceApi';
import attendanceApi from './attendanceApi';
import AttendanceCalendar from './AttendanceCalendar';
import './AttendancePage.css';

const AttendancePage = () => {
  const [userType] = useState(localStorage.getItem('user_type') || 'student');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  
  // Course management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', description: '', semester: '' });

  // Session management
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSession, setNewSession] = useState({ 
    session_date: '', 
    start_time: '', 
    end_time: '', 
    room: '' 
  });

  // Manual mark modal
  const [showManualMarkModal, setShowManualMarkModal] = useState(false);
  const [modalSession, setModalSession] = useState(null);
  const [modalStudents, setModalStudents] = useState([]);
  const [modalAttendanceStatus, setModalAttendanceStatus] = useState({});
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  // Attendance marking
  const [sessionAttendance, setSessionAttendance] = useState([]);
  const [attendanceUpdates, setAttendanceUpdates] = useState({});

  // My attendance (for students)
  const [myAttendance, setMyAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});

  // Profile
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
    if (userType === 'student') {
      fetchMyAttendance();
      fetchMyProfile();
    }
  }, [userType]);

  // Fetch sessions when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseSessions(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Fetch attendance when session is selected
  useEffect(() => {
    if (selectedSession && userType === 'faculty') {
      fetchSessionAttendance(selectedSession.id);
    }
  }, [selectedSession]);

  // Faculty: Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getMyCourses();
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Create new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const courseData = {
        ...newCourse,
        code: newCourse.code.toUpperCase(),
      };
      const response = await courseApi.createCourse(courseData);
      setCourses([...courses, response.data]);
      setNewCourse({ code: '', name: '', description: '', semester: '' });
      setShowNewCourseForm(false);
      setSuccess('Course created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions for a course
  const fetchCourseSessions = async (courseId) => {
    try {
      setLoading(true);
      const response = await sessionApi.getCourseSessions(courseId);
      setSessions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Create new session
  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      setError('Please select a course first');
      return;
    }

    try {
      setLoading(true);
      const sessionData = {
        ...newSession,
        course: selectedCourse.id,
        status: 'scheduled',
      };
      const response = await sessionApi.createSession(sessionData);
      setSessions([...sessions, response.data]);
      setNewSession({ session_date: '', start_time: '', end_time: '', room: '' });
      setShowNewSessionForm(false);
      setSuccess('Session created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Fetch attendance for session
  const fetchSessionAttendance = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionApi.getSessionAttendance(sessionId);
      setSessionAttendance(response.data);
      setAttendanceUpdates({});
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Update attendance status
  const handleAttendanceChange = (recordId, status) => {
    setAttendanceUpdates({
      ...attendanceUpdates,
      [recordId]: status,
    });
  };

  // Faculty: Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedSession) {
      setError('Please select a session first');
      return;
    }

    const updates = Object.entries(attendanceUpdates).map(([recordId, status]) => {
      const record = sessionAttendance.find(r => r.id === recordId);
      return {
        record_id: recordId,
        status: status,
        notes: record?.notes || '',
      };
    });

    if (updates.length === 0) {
      setError('No changes to save');
      return;
    }

    try {
      setLoading(true);
      await sessionApi.markAttendance(selectedSession.id, updates);
      fetchSessionAttendance(selectedSession.id);
      setSuccess('Attendance saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Open manual mark modal and fetch enrolled students
  const openManualMarkModal = async (session) => {
    try {
      setLoading(true);
      setModalSession(session);
      
      // Fetch enrolled students for the course
      const response = await courseApi.getEnrolledStudents(session.course_id);
      const students = response.data;
      
      setModalStudents(students);
      setModalAttendanceStatus({});
      setShowManualMarkModal(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch enrolled students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faculty: Close manual mark modal
  const closeManualMarkModal = () => {
    setShowManualMarkModal(false);
    setModalSession(null);
    setModalStudents([]);
    setModalAttendanceStatus({});
  };

  // Faculty: Update attendance status in modal
  const handleModalAttendanceStatusChange = (studentId, status) => {
    setModalAttendanceStatus({
      ...modalAttendanceStatus,
      [studentId]: status,
    });
  };

  // Faculty: Submit manual attendance marking
  const submitManualAttendance = async () => {
    if (!modalSession) {
      setError('No session selected');
      return;
    }

    const attendanceData = Object.entries(modalAttendanceStatus).map(([studentId, status]) => ({
      student_id: parseInt(studentId),
      status: status,
    }));

    if (attendanceData.length === 0) {
      setError('Please select status for at least one student');
      return;
    }

    try {
      setIsMarkingAttendance(true);
      
      // Use the batch endpoint to mark attendance for all students at once
      const response = await attendanceApi.post(
        `/sessions/${modalSession.id}/mark_attendance_batch/`,
        { attendance: attendanceData }
      );
      
      setSuccess(`Attendance marked for ${response.data.records.length} students`);
      closeManualMarkModal();
      
      // Refresh the session if it's selected
      if (selectedSession?.id === modalSession.id) {
        fetchSessionAttendance(modalSession.id);
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
      console.error(err);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  // Student: Fetch my attendance
  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      const response = await recordApi.getMyAttendance();
      setMyAttendance(response.data.records);
      setAttendanceStats(response.data.stats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Student: Fetch profile
  const fetchMyProfile = async () => {
    try {
      const response = await profileApi.getMyProfile();
      if (response.data.profile?.profile_photo) {
        setProfilePhoto(response.data.profile.profile_photo);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  // Student: Upload profile photo
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profile_photo', file);

      const response = await profileApi.uploadProfilePhoto(formData);
      setProfilePhoto(response.data.profile_photo);
      setProfilePhotoFile(null);
      setSuccess('Profile photo uploaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to upload photo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render faculty view
  if (userType === 'faculty') {
    if (viewMode === 'calendar') {
      return (
        <div className="attendance-page">
          <div className="view-switcher">
            <button 
              className={`switch-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar View
            </button>
            <button 
              className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List View
            </button>
          </div>
          <AttendanceCalendar />
        </div>
      );
    }

    return (
      <div className="attendance-page">
        <div className="view-switcher">
          <button 
            className={`switch-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar View
          </button>
          <button 
            className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
        </div>
        <div className="attendance-container">
          <h1>Attendance Management</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="attendance-layout">
            {/* Left Panel: Courses */}
            <div className="panel courses-panel">
              <div className="panel-header">
                <h2>My Courses</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowNewCourseForm(!showNewCourseForm)}
                >
                  {showNewCourseForm ? 'Cancel' : '+ New Course'}
                </button>
              </div>

              {showNewCourseForm && (
                <form onSubmit={handleCreateCourse} className="form-section">
                  <input
                    type="text"
                    placeholder="Course Code"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Semester"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                  />
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                </form>
              )}

              <div className="courses-list">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="course-info">
                      <div className="course-code">{course.code}</div>
                      <div className="course-name">{course.name}</div>
                      <div className="enrollments-count">
                        {course.enrollments_count} students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Panel: Sessions */}
            <div className="panel sessions-panel">
              <div className="panel-header">
                <h2>Sessions</h2>
                {selectedCourse && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowNewSessionForm(!showNewSessionForm)}
                  >
                    {showNewSessionForm ? 'Cancel' : '+ New Session'}
                  </button>
                )}
              </div>

              {!selectedCourse ? (
                <p className="placeholder">Select a course to view sessions</p>
              ) : (
                <>
                  {showNewSessionForm && (
                    <form onSubmit={handleCreateSession} className="form-section">
                      <input
                        type="date"
                        value={newSession.session_date}
                        onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
                        required
                      />
                      <input
                        type="time"
                        value={newSession.start_time}
                        onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })}
                        required
                      />
                      <input
                        type="time"
                        value={newSession.end_time}
                        onChange={(e) => setNewSession({ ...newSession, end_time: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Room"
                        value={newSession.room}
                        onChange={(e) => setNewSession({ ...newSession, room: e.target.value })}
                      />
                      <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Session'}
                      </button>
                    </form>
                  )}

                  <div className="sessions-list">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`session-item ${selectedSession?.id === session.id ? 'active' : ''}`}
                      >
                        <div 
                          className="session-info"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="session-date">
                            {new Date(session.session_date).toLocaleDateString()}
                          </div>
                          <div className="session-time">
                            {session.start_time} - {session.end_time || 'TBA'}
                          </div>
                          <div className="session-room">{session.room}</div>
                          <span className={`status-badge status-${session.status}`}>
                            {session.status}
                          </span>
                        </div>
                        <button
                          className="btn btn-manual-mark btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openManualMarkModal(session);
                          }}
                          disabled={loading}
                          title="Manually mark attendance for this session"
                        >
                          ✋ Manual Mark
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Panel: Attendance Marking */}
            <div className="panel attendance-panel">
              <div className="panel-header">
                <h2>Mark Attendance</h2>
                {selectedSession && sessionAttendance.length > 0 && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={handleSaveAttendance}
                    disabled={loading || Object.keys(attendanceUpdates).length === 0}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>

              {!selectedSession ? (
                <p className="placeholder">Select a session to mark attendance</p>
              ) : (
                <div className="attendance-records">
                  {sessionAttendance.length === 0 ? (
                    <p className="placeholder">No students enrolled</p>
                  ) : (
                    sessionAttendance.map((record) => (
                      <div key={record.id} className="attendance-record">
                        <div className="student-info">
                          <div className="student-name">{record.student.full_name}</div>
                          <div className="student-id">{record.student.username}</div>
                        </div>
                        <select
                          value={attendanceUpdates[record.id] || record.status}
                          onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Mark Modal */}
        {showManualMarkModal && (
          <div className="modal-overlay" onClick={closeManualMarkModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Mark Attendance</h2>
                <h3 className="modal-subtitle">
                  {modalSession && new Date(modalSession.session_date).toLocaleDateString()}{' '}
                  - {modalSession?.start_time}
                </h3>
                <button 
                  className="modal-close"
                  onClick={closeManualMarkModal}
                  disabled={isMarkingAttendance}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {modalStudents.length === 0 ? (
                  <p className="placeholder">No students enrolled in this course</p>
                ) : (
                  <div className="students-attendance-list">
                    {modalStudents.map((student) => (
                      <div key={student.id} className="student-attendance-item">
                        <div className="student-details">
                          <div className="student-name">
                            {student.user?.full_name}
                          </div>
                          <div className="student-id">
                            {student.id}
                          </div>
                        </div>
                        <div className="status-buttons">
                          <button
                            className={`status-btn present ${
                              modalAttendanceStatus[student.user?.id] === 'present' ? 'active' : ''
                            }`}
                            onClick={() => handleModalAttendanceStatusChange(student.user?.id, 'present')}
                            disabled={isMarkingAttendance}
                            title="Present"
                          >
                            ✅
                          </button>
                          <button
                            className={`status-btn absent ${
                              modalAttendanceStatus[student.user?.id] === 'absent' ? 'active' : ''
                            }`}
                            onClick={() => handleModalAttendanceStatusChange(student.user?.id, 'absent')}
                            disabled={isMarkingAttendance}
                            title="Absent"
                          >
                            ❌
                          </button>
                          <button
                            className={`status-btn late ${
                              modalAttendanceStatus[student.user?.id] === 'late' ? 'active' : ''
                            }`}
                            onClick={() => handleModalAttendanceStatusChange(student.user?.id, 'late')}
                            disabled={isMarkingAttendance}
                            title="Late"
                          >
                            ⏰
                          </button>
                          <button
                            className={`status-btn excused ${
                              modalAttendanceStatus[student.user?.id] === 'excused' ? 'active' : ''
                            }`}
                            onClick={() => handleModalAttendanceStatusChange(student.user?.id, 'excused')}
                            disabled={isMarkingAttendance}
                            title="Excused"
                          >
                            📝
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeManualMarkModal}
                  disabled={isMarkingAttendance}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={submitManualAttendance}
                  disabled={isMarkingAttendance || Object.keys(modalAttendanceStatus).length === 0}
                >
                  {isMarkingAttendance ? 'Marking...' : 'Mark Attendance'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render student view
  if (viewMode === 'calendar') {
    return (
      <div className="attendance-page">
        <div className="view-switcher">
          <button 
            className={`switch-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar View
          </button>
          <button 
            className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
        </div>
        <AttendanceCalendar />
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="view-switcher">
        <button 
          className={`switch-btn ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          📅 Calendar View
        </button>
        <button 
          className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 List View
        </button>
      </div>
      <div className="attendance-container">
        <h1>My Attendance</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="student-view">
          {/* Profile Section */}
          <div className="profile-section">
            <h2>Profile Photo</h2>
            <div className="profile-photo-container">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-placeholder">No photo</div>
              )}
            </div>
            <label className="btn btn-primary file-input">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                disabled={loading}
              />
            </label>
          </div>

          {/* Attendance Stats */}
          <div className="stats-section">
            <h2>Attendance Summary</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Sessions</div>
                <div className="stat-value">{attendanceStats.total || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Present</div>
                <div className="stat-value present">{attendanceStats.present || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Absent</div>
                <div className="stat-value absent">{attendanceStats.absent || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Late</div>
                <div className="stat-value late">{attendanceStats.late || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Excused</div>
                <div className="stat-value excused">{attendanceStats.excused || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Attendance %</div>
                <div className="stat-value percentage">
                  {attendanceStats.attendance_percentage || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="records-section">
            <h2>Attendance Details</h2>
            {myAttendance.length === 0 ? (
              <p className="placeholder">No attendance records yet</p>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Confidence</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {myAttendance.map((record) => (
                    <tr key={record.id} className={`status-${record.status}`}>
                      <td>{new Date(record.session.session_date).toLocaleDateString()}</td>
                      <td>{record.session.course.code}</td>
                      <td>
                        <span className={`badge status-${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        {record.confidence_score ? `${(record.confidence_score * 100).toFixed(1)}%` : '-'}
                      </td>
                      <td>{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
