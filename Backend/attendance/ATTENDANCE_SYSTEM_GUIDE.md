# Enhanced Attendance Management System

## Overview

The attendance system has been redesigned to support a two-tab interface where faculty can:
1. **Tab 1 - Courses**: Create and manage courses with branch/duration information, then create multiple sessions within each course
2. **Tab 2 - Mark Attendance**: Mark attendance for students in course sessions

## System Architecture

### Models

#### Course
- **Fields**:
  - `title`: Course name
  - `code`: Unique course code
  - `faculty`: Faculty member teaching the course
  - `description`: Course description
  - `branch`: Selected branch (CSE, ECE, MECH, CIVIL, EEE, IT, BT)
  - `semester`: Semester number
  - `start_date`: Course start date (for calendar selection)
  - `end_date`: Course end date (for calendar selection)
  - `created_at`, `updated_at`: Timestamps

#### AttendanceSession
- **Fields**:
  - `course`: Reference to the course
  - `faculty`: Faculty member managing the session
  - `title`: Session title (e.g., "Lecture 1", "Lab Session 1")
  - `date`: Session date
  - `start_time`: Session start time
  - `end_time`: Session end time (optional)
  - `is_processed`: Whether session has been processed
  - `created_at`, `updated_at`: Timestamps

#### CourseEnrollment
- Links students to courses
- Tracks enrollment date

#### AttendanceRecord
- Contains individual student attendance records for each session
- Tracks status (present, absent, late, excused)
- Records detection source (manual_entry, facial_recognition)

## API Documentation

### Course Endpoints

#### 1. List Courses (Faculty View)
**Endpoint**: `GET /api/attendance/courses/`

**Query Parameters**:
- `branch`: Filter by branch (CSE, ECE, MECH, etc.)
- `semester`: Filter by semester number

**Response**:
```json
[
  {
    "id": 1,
    "title": "Data Structures",
    "code": "CS101",
    "faculty": 1,
    "faculty_name": "Dr. John Doe",
    "description": "Introduction to Data Structures",
    "branch": "CSE",
    "semester": 1,
    "start_date": "2024-01-15",
    "end_date": "2024-05-30",
    "sessions_count": 5,
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-10T10:00:00Z"
  }
]
```

#### 2. Create a Course
**Endpoint**: `POST /api/attendance/courses/`

**Request Body**:
```json
{
  "title": "Data Structures",
  "code": "CS101",
  "description": "Introduction to Data Structures",
  "branch": "CSE",
  "semester": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-05-30"
}
```

#### 3. Get Available Branches
**Endpoint**: `GET /api/attendance/courses/available_branches/`

**Response**:
```json
{
  "branches": [
    {"value": "CSE", "label": "Computer Science & Engineering"},
    {"value": "ECE", "label": "Electronics & Communication Engineering"},
    {"value": "MECH", "label": "Mechanical Engineering"},
    {"value": "CIVIL", "label": "Civil Engineering"},
    {"value": "EEE", "label": "Electrical & Electronics Engineering"},
    {"value": "IT", "label": "Information Technology"},
    {"value": "BT", "label": "Biotechnology"}
  ]
}
```

#### 4. Get Course Sessions
**Endpoint**: `GET /api/attendance/courses/{id}/sessions/`

**Response**:
```json
[
  {
    "id": 1,
    "course": 1,
    "course_code": "CS101",
    "course_title": "Data Structures",
    "course_branch": "CSE",
    "faculty": 1,
    "faculty_name": "Dr. John Doe",
    "title": "Lecture 1",
    "date": "2024-01-15",
    "start_time": "09:00:00",
    "end_time": "10:30:00",
    "is_processed": false,
    "attendance_count": 25,
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
]
```

#### 5. Create a Session for a Course
**Endpoint**: `POST /api/attendance/courses/{id}/create_session/`

**Request Body**:
```json
{
  "title": "Lecture 1 - Introduction",
  "date": "2024-01-15",
  "start_time": "09:00:00",
  "end_time": "10:30:00"
}
```

#### 6. Add Students to Course
**Endpoint**: `POST /api/attendance/courses/{id}/add_students/`

**Request Body**:
```json
{
  "student_ids": [1, 2, 3, 4, 5]
}
```

#### 7. Get Enrolled Students
**Endpoint**: `GET /api/attendance/courses/{id}/enrolled_students/`

**Response**:
```json
[
  {
    "id": 1,
    "course": 1,
    "student": {
      "id": 10,
      "email": "student1@university.edu",
      "first_name": "John",
      "last_name": "Smith",
      "full_name": "John Smith"
    },
    "student_id": 10,
    "course_code": "CS101",
    "enrolled_at": "2024-01-10T10:00:00Z"
  }
]
```

### AttendanceSession Endpoints

#### 1. List Sessions
**Endpoint**: `GET /api/attendance/sessions/`

**Query Parameters**:
- `course_id`: Filter by course ID

**Response**: (Similar to course sessions response)

#### 2. Get Session Enrolled Students
**Endpoint**: `GET /api/attendance/sessions/{id}/enrolled_students/`

Returns all students enrolled in the session's course.

#### 3. Get Session Attendance Records
**Endpoint**: `GET /api/attendance/sessions/{id}/attendance_records/`

**Response**:
```json
[
  {
    "id": 1,
    "session": 1,
    "student": 10,
    "student_email": "student1@university.edu",
    "student_name": "John Smith",
    "status": "present",
    "detection_source": "manual_entry",
    "confidence_score": null,
    "course_code": "CS101",
    "session_date": "2024-01-15",
    "created_at": "2024-01-15T09:10:00Z",
    "updated_at": "2024-01-15T09:10:00Z"
  }
]
```

#### 4. Mark Attendance in Batch
**Endpoint**: `POST /api/attendance/sessions/{id}/mark_attendance_batch/`

**Request Body**:
```json
{
  "attendance": [
    {
      "student_id": 10,
      "status": "present"
    },
    {
      "student_id": 11,
      "status": "absent"
    },
    {
      "student_id": 12,
      "status": "late"
    },
    {
      "student_id": 13,
      "status": "excused"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Attendance marked for 4 students",
  "records": [
    {
      "id": 1,
      "session": 1,
      "student": 10,
      "student_email": "student1@university.edu",
      "student_name": "John Smith",
      "status": "present",
      "detection_source": "manual_entry",
      "confidence_score": null,
      "course_code": "CS101",
      "session_date": "2024-01-15",
      "created_at": "2024-01-15T09:10:00Z",
      "updated_at": "2024-01-15T09:10:00Z"
    }
  ],
  "errors": []
}
```

## Workflow

### For Faculty

#### Step 1: Create a Course
1. Go to the Courses tab
2. Click "Create New Course"
3. Fill in:
   - Course Title
   - Course Code (unique)
   - Branch (from dropdown - CSE, ECE, etc.)
   - Semester
   - Course Description
   - Start Date (using calendar picker)
   - End Date (using calendar picker)
4. Click "Create"

#### Step 2: Add Students to Course
1. Select a course
2. Click "Add Students"
3. Select students from the branch you chose
4. Click "Add Enrollment"

#### Step 3: Create Sessions
1. Select a course
2. Click "Create Session"
3. Fill in:
   - Session Title (e.g., "Lecture 1", "Lab Session 1")
   - Date
   - Start Time
   - End Time
4. Click "Create Session"
5. Repeat for multiple sessions

#### Step 4: Mark Attendance
1. Go to the Mark Attendance tab (or Courses tab → Sessions)
2. Select a session
3. You'll see a list of all enrolled students
4. For each student, select their status:
   - Present
   - Absent
   - Late
   - Excused
5. Click "Submit Attendance"

## Database Schema Changes

### New Fields in Course Model
- `branch` - CharField with choices (CSE, ECE, MECH, CIVIL, EEE, IT, BT)
- `semester` - IntegerField (default: 1)
- `start_date` - DateField
- `end_date` - DateField

### New Fields in AttendanceSession Model
- `title` - CharField (session title)
- `start_time` - TimeField (replacing `time`)
- `end_time` - TimeField (optional)
- Removed `time` field (replaced with `start_time` and `end_time`)
- Added `updated_at` - DateTimeField

## Status Values

Attendance status can be one of:
- `present` - Student is present
- `absent` - Student is absent
- `late` - Student is late
- `excused` - Student has excused absence

## Detection Source Values

- `manual_entry` - Attendance marked manually by faculty
- `facial_recognition` - Attendance detected via facial recognition

## Benefits

1. **Organized Structure**: Courses are now organized by branch and semester
2. **Calendar-based Planning**: Use calendar selectors for course duration
3. **Multiple Sessions**: Create as many sessions as needed within a course
4. **Batch Attendance Marking**: Mark attendance for all students at once
5. **Better Data Tracking**: Sessions are independent and can be processed separately
6. **Clear Separation of Concerns**: Tab 1 for course management, Tab 2 for attendance marking

## Migration Notes

- The system automatically migrates from old `time` field to `start_time` and `end_time`
- Existing sessions will have `start_time` as NULL - these should be updated when sessions are next edited
- All existing courses are still functional; new fields are optional
