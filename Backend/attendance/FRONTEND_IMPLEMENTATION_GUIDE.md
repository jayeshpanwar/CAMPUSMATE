# Frontend Implementation Guide - Two-Tab Attendance System

## Overview

The frontend needs to implement a two-tab interface for faculty to manage attendance. This guide provides component structure and API integration details.

## Component Structure

```
AttendancePage/
├── AttendancePage.jsx (Main container)
├── CoursesTab.jsx (Tab 1 - Course Management)
│   ├── CoursesList.jsx
│   ├── CourseForm.jsx
│   ├── SessionsList.jsx
│   └── SessionForm.jsx
├── MarkAttendanceTab.jsx (Tab 2 - Attendance Marking)
│   ├── SessionSelector.jsx
│   ├── AttendanceTable.jsx
│   └── SubmitButton.jsx
└── attendanceApi.js (API client)
```

## Tab 1 - Courses Management

### Functionality

#### 1. Course List View
- Display all courses created by the faculty
- Filter by branch and semester
- Show course duration (start_date to end_date)
- Show number of sessions
- Actions: View Details, Edit, Add Students, Create Session

#### 2. Create/Edit Course Form
- Course Title (text input)
- Course Code (text input, unique)
- Description (textarea)
- **Branch Selection** (dropdown)
  ```javascript
  branches: [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'BT', label: 'Biotechnology' }
  ]
  ```
- **Semester** (number input, default 1)
- **Start Date** (calendar picker)
- **End Date** (calendar picker)

#### 3. Sessions List (within course view)
- Show all sessions for selected course
- Display: Session Title, Date, Start Time, End Time, Attendance Count
- Actions: Edit, View Attendance, Delete

#### 4. Create Session Form
- Session Title (text input)
- Date (calendar picker)
- Start Time (time picker)
- End Time (time picker)

#### 5. Add Students Form
- Display students from selected branch
- Multi-select checkboxes or dropdown
- Search/filter students by name/ID
- Bulk select option

### API Calls

```javascript
// Load courses
GET /api/attendance/courses/?branch=CSE&semester=2

// Load available branches
GET /api/attendance/courses/available_branches/

// Create course
POST /api/attendance/courses/
payload: { title, code, description, branch, semester, start_date, end_date }

// Get course sessions
GET /api/attendance/courses/{courseId}/sessions/

// Create session
POST /api/attendance/courses/{courseId}/create_session/
payload: { title, date, start_time, end_time }

// Add students to course
POST /api/attendance/courses/{courseId}/add_students/
payload: { student_ids: [1, 2, 3] }

// Get enrolled students
GET /api/attendance/courses/{courseId}/enrolled_students/
```

## Tab 2 - Mark Attendance

### Functionality

#### 1. Session Selector
- Dropdown or list of all sessions
- Show session details: Course Code, Title, Date, Time
- Filter by course
- Filter by date range

#### 2. Attendance Table
- Columns:
  - Student ID
  - Student Name
  - Current Status (if already marked)
  - Status Selector (dropdown: Present, Absent, Late, Excused)

#### 3. Batch Submission
- "Submit Attendance" button
- Confirmation dialog before submission
- Show success/error messages
- Option to print or export attendance report

### API Calls

```javascript
// Get session details
GET /api/attendance/sessions/{sessionId}/

// Get enrolled students for session
GET /api/attendance/sessions/{sessionId}/enrolled_students/

// Get current attendance records
GET /api/attendance/sessions/{sessionId}/attendance_records/

// Mark attendance batch
POST /api/attendance/sessions/{sessionId}/mark_attendance_batch/
payload: {
  attendance: [
    { student_id: 10, status: 'present' },
    { student_id: 11, status: 'absent' },
    { student_id: 12, status: 'late' },
    { student_id: 13, status: 'excused' }
  ]
}
```

## API Client Implementation (attendanceApi.js)

```javascript
const API_BASE = 'http://localhost:8000/api/attendance';

export const attendanceApi = {
  // Courses
  getCourses: (branch?, semester?) => {
    let url = `${API_BASE}/courses/`;
    const params = [];
    if (branch) params.push(`branch=${branch}`);
    if (semester) params.push(`semester=${semester}`);
    if (params.length) url += '?' + params.join('&');
    return axios.get(url);
  },

  getAvailableBranches: () => {
    return axios.get(`${API_BASE}/courses/available_branches/`);
  },

  createCourse: (courseData) => {
    return axios.post(`${API_BASE}/courses/`, courseData);
  },

  updateCourse: (courseId, courseData) => {
    return axios.put(`${API_BASE}/courses/${courseId}/`, courseData);
  },

  deleteCourse: (courseId) => {
    return axios.delete(`${API_BASE}/courses/${courseId}/`);
  },

  // Sessions
  getSessions: (courseId?) => {
    let url = `${API_BASE}/sessions/`;
    if (courseId) url += `?course_id=${courseId}`;
    return axios.get(url);
  },

  getCourseSessions: (courseId) => {
    return axios.get(`${API_BASE}/courses/${courseId}/sessions/`);
  },

  createSession: (courseId, sessionData) => {
    return axios.post(
      `${API_BASE}/courses/${courseId}/create_session/`,
      sessionData
    );
  },

  updateSession: (sessionId, sessionData) => {
    return axios.put(`${API_BASE}/sessions/${sessionId}/`, sessionData);
  },

  deleteSession: (sessionId) => {
    return axios.delete(`${API_BASE}/sessions/${sessionId}/`);
  },

  // Students
  getEnrolledStudents: (courseId) => {
    return axios.get(`${API_BASE}/courses/${courseId}/enrolled_students/`);
  },

  getSessionEnrolledStudents: (sessionId) => {
    return axios.get(`${API_BASE}/sessions/${sessionId}/enrolled_students/`);
  },

  addStudents: (courseId, studentIds) => {
    return axios.post(`${API_BASE}/courses/${courseId}/add_students/`, {
      student_ids: studentIds
    });
  },

  // Attendance
  getSessionAttendance: (sessionId) => {
    return axios.get(`${API_BASE}/sessions/${sessionId}/attendance_records/`);
  },

  markAttendanceBatch: (sessionId, attendanceData) => {
    return axios.post(
      `${API_BASE}/sessions/${sessionId}/mark_attendance_batch/`,
      { attendance: attendanceData }
    );
  }
};
```

## UI/UX Recommendations

### Tab 1 - Courses
```
┌─────────────────────────────────────────┐
│ Tab 1: Courses | Tab 2: Mark Attendance│
├─────────────────────────────────────────┤
│                                          │
│  Filter: [Branch ▼] [Semester ▼] [Search]
│  [+ New Course]                          │
│                                          │
│  ┌──────────────────────────────────────┐
│  │ Course List                          │
│  ├──────────────────────────────────────┤
│  │ CS101 | Data Structures | CSE | Sem1 │
│  │ Jan 15 - May 30 | 5 sessions         │
│  │ [View Sessions] [Add Students] [Edit]│
│  │                                      │
│  │ CS205 | Web Dev | CSE | Sem2         │
│  │ Jan 15 - May 30 | 3 sessions         │
│  │ [View Sessions] [Add Students] [Edit]│
│  └──────────────────────────────────────┘
│                                          │
│  Selected: Data Structures (CS101)       │
│  ┌──────────────────────────────────────┐
│  │ Sessions                             │
│  ├──────────────────────────────────────┤
│  │ Lecture 1 - Intro | Jan 15, 9:00-10:30
│  │ Lecture 2 - Arrays| Jan 17, 9:00-10:30
│  │ Lab 1 | Jan 22, 2:00-4:00            │
│  │ [+ New Session]                      │
│  └──────────────────────────────────────┘
└─────────────────────────────────────────┘
```

### Tab 2 - Mark Attendance
```
┌─────────────────────────────────────────┐
│ Tab 1: Courses | Tab 2: Mark Attendance│
├─────────────────────────────────────────┤
│                                          │
│  Session: [Select Session ▼]             │
│  Course: CS101 | Title: Lecture 1       │
│  Date: Jan 15, 2024 | Time: 9:00-10:30 │
│                                          │
│  ┌──────────────────────────────────────┐
│  │ Student ID | Name | Status ▼        │
│  ├──────────────────────────────────────┤
│  │ 101 | John Smith | Present ▼         │
│  │ 102 | Jane Doe | Absent ▼            │
│  │ 103 | Bob Johnson | Late ▼           │
│  │ 104 | Alice Williams | Present ▼     │
│  │ 105 | Michael Brown | Excused ▼      │
│  │                                      │
│  │ [Select All] [Clear All]             │
│  └──────────────────────────────────────┘
│                                          │
│                  [Submit Attendance]     │
│                                          │
└─────────────────────────────────────────┘
```

## Form Validation Rules

### Course Form
- Title: Required, min 3 chars, max 200 chars
- Code: Required, unique, alphanumeric + underscore, max 50 chars
- Branch: Required, must be from list
- Semester: Required, integer 1-8
- Start Date: Required, must be before End Date
- End Date: Required, must be after Start Date

### Session Form
- Title: Required, min 3 chars, max 200 chars
- Date: Required, must be within course dates
- Start Time: Required, valid 24-hour time
- End Time: Optional, must be after Start Time if provided

### Attendance Form
- At least one student must have a status selected
- Status must be one of: present, absent, late, excused

## Error Handling

```javascript
try {
  const response = await attendanceApi.markAttendanceBatch(sessionId, data);
  showSuccessMessage(`Attendance marked for ${response.data.records.length} students`);
  if (response.data.errors?.length > 0) {
    showWarningMessage(`${response.data.errors.length} students had errors`);
  }
} catch (error) {
  if (error.response?.status === 403) {
    showErrorMessage('Only the faculty can mark attendance');
  } else if (error.response?.status === 404) {
    showErrorMessage('Session not found');
  } else {
    showErrorMessage('Failed to mark attendance: ' + error.message);
  }
}
```

## State Management Example (React Hooks)

```javascript
function AttendancePage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [branches, setBranches] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBranches();
    loadCourses();
  }, []);

  const loadBranches = async () => {
    const { data } = await attendanceApi.getAvailableBranches();
    setBranches(data.branches);
  };

  const loadCourses = async (branch?, semester?) => {
    setLoading(true);
    const { data } = await attendanceApi.getCourses(branch, semester);
    setCourses(data);
    setLoading(false);
  };

  const handleCreateSession = async (courseId, sessionData) => {
    try {
      await attendanceApi.createSession(courseId, sessionData);
      await loadCourseSessions(courseId);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // ... more handlers
}
```

## Testing Checklist

- [ ] Create course with all fields
- [ ] Filter courses by branch and semester
- [ ] Create multiple sessions for a course
- [ ] Add students to course
- [ ] View course enrollments
- [ ] Mark attendance for all students
- [ ] Submit batch attendance
- [ ] View previously marked attendance
- [ ] Test error messages
- [ ] Test date/time validation
- [ ] Test form validation
- [ ] Test responsive design on mobile

---

**Ready to implement?** Start with Tab 1 (Courses), then move to Tab 2 (Mark Attendance).
