import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { sessionApi, recordApi, courseApi } from './attendanceApi';
import './AttendanceCalendar.css';

const AttendanceCalendar = () => {
  const [userType] = useState(localStorage.getItem('user_type') || 'student');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [markingMode, setMarkingMode] = useState(false);
  const [tempMarks, setTempMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [studentStates, setStudentStates] = useState({});

  // For faculty: show all enrollments on selected date
  const [selectedDateStudents, setSelectedDateStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      if (userType === 'student') {
        fetchStudentAttendance(selectedCourse.id);
      } else {
        fetchCourseSessions(selectedCourse.id);
      }
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = userType === 'student' 
        ? await courseApi.getEnrolledCourses()
        : await courseApi.getMyCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async (courseId) => {
    try {
      setLoading(true);
      const response = await recordApi.getMyAttendance();
      
      // Group attendance by date for this course
      const marks = {};
      response.data.records.forEach(record => {
        const date = new Date(record.session.date);
        const dateKey = date.toISOString().split('T')[0];
        if (record.session.course.id === courseId) {
          marks[dateKey] = record.status;
        }
      });
      
      setAttendanceRecords(marks);
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseSessions = async (courseId) => {
    try {
      setLoading(true);
      const response = await sessionApi.getCourseSessions(courseId);
      setSessions(response.data);

      // Fetch sessions for calendar grouping
      const sessionsByDate = {};
      response.data.forEach(session => {
        const dateKey = session.date;
        if (!sessionsByDate[dateKey]) {
          sessionsByDate[dateKey] = [];
        }
        sessionsByDate[dateKey].push(session);
      });

      // For faculty, initialize temp marks
      const initialMarks = {};
      Object.keys(sessionsByDate).forEach(date => {
        initialMarks[date] = {};
      });
      setTempMarks(initialMarks);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (dateString) => {
    if (userType === 'faculty' && markingMode) {
      // Find session for this date
      const sessionsOnDate = sessions.filter(s => s.date === dateString);
      if (sessionsOnDate.length > 0) {
        try {
          setLoading(true);
          const response = await sessionApi.getSessionAttendance(sessionsOnDate[0].id);
          setStudentStates({});
          response.data.forEach(record => {
            setStudentStates(prev => ({
              ...prev,
              [record.id]: record.status
            }));
          });
          setSelectedDateStudents(response.data);
          setSelectedModalDate(dateString);
          setShowStudentModal(true);
        } catch (err) {
          setError('Failed to fetch students for this date');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleMarkAttendance = (recordId, status) => {
    setStudentStates(prev => ({
      ...prev,
      [recordId]: status
    }));
  };

  const handleSaveMarks = async () => {
    if (!selectedModalDate || !selectedCourse) {
      setError('Please select date and course');
      return;
    }

    const sessionsOnDate = sessions.filter(s => s.date === selectedModalDate);
    if (sessionsOnDate.length === 0) {
      setError('No session found for this date');
      return;
    }

    // Find which records were changed
    const updates = [];
    selectedDateStudents.forEach(record => {
      if (studentStates[record.id] && studentStates[record.id] !== record.status) {
        updates.push({
          record_id: record.id,
          status: studentStates[record.id],
          notes: record.notes || ''
        });
      }
    });

    if (updates.length === 0) {
      setError('No changes to save');
      return;
    }

    try {
      setLoading(true);
      await sessionApi.markAttendance(sessionsOnDate[0].id, updates);
      setSuccess('Attendance marked successfully');
      setShowStudentModal(false);
      setSelectedDateStudents([]);
      setStudentStates({});
      // Refresh sessions to update calendar
      await fetchCourseSessions(selectedCourse.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save attendance marks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getAttendanceStatus = (dateString) => {
    return attendanceRecords[dateString] || null;
  };

  const getSessionCount = (dateString) => {
    return sessions.filter(s => s.date === dateString).length;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const status = userType === 'student' ? getAttendanceStatus(dateString) : null;
      const sessionCount = userType === 'faculty' ? getSessionCount(dateString) : 0;
      const isClickable = userType === 'faculty' && markingMode && sessionCount > 0;

      days.push(
        <div
          key={day}
          className={`calendar-day ${status ? `status-${status}` : ''} ${isClickable ? 'clickable' : ''} ${sessionCount > 0 ? 'has-session' : ''}`}
          onClick={() => handleDateClick(dateString)}
          title={userType === 'faculty' ? `${sessionCount} session(s)` : status || 'No attendance'}
        >
          <div className="day-number">{day}</div>
          {userType === 'student' && status && (
            <div className={`status-indicator status-${status}`}>
              {status === 'present' && '✓'}
              {status === 'absent' && '✗'}
              {status === 'late' && '◐'}
              {status === 'excused' && '○'}
            </div>
          )}
          {userType === 'faculty' && sessionCount > 0 && (
            <div className="session-count">{sessionCount}</div>
          )}
        </div>
      );
    }

    return { days, monthName };
  };

  const { days: calendarDays, monthName } = renderCalendar();

  if (loading && courses.length === 0) {
    return <div className="calendar-loading">Loading...</div>;
  }

  return (
    <div className="attendance-calendar-page">
      <div className="calendar-container">
        <h1>
          <Calendar size={28} />
          Attendance Calendar
        </h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="calendar-controls">
          <div className="course-selector">
            <label>Select Course:</label>
            <select
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const course = courses.find(c => c.id === parseInt(e.target.value));
                setSelectedCourse(course);
              }}
            >
              <option value="">-- Select a course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          {userType === 'faculty' && (
            <div className="marking-toggle">
              <button
                className={`btn ${markingMode ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => setMarkingMode(!markingMode)}
              >
                {markingMode ? '✓ Exit Marking Mode' : '+ Enter Marking Mode'}
              </button>
            </div>
          )}
        </div>

        <div className="calendar-wrapper">
          {/* Calendar Header */}
          <div className="calendar-header">
            <button className="nav-btn" onClick={getPrevMonth}>
              <ChevronLeft size={20} />
            </button>
            <h2>{monthName}</h2>
            <button className="nav-btn" onClick={getNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Weekday headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}

            {/* Days */}
            {calendarDays}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-title">Legend:</div>
            {userType === 'student' ? (
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color present">✓</span>
                  <span>Present</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color absent">✗</span>
                  <span>Absent</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color late">◐</span>
                  <span>Late</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color excused">○</span>
                  <span>Excused</span>
                </div>
              </div>
            ) : (
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color session-indicator">◉</span>
                  <span>Click date to mark attendance</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Modal for Faculty Marking */}
      {showStudentModal && userType === 'faculty' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Mark Attendance for {selectedModalDate}</h3>
              <button
                className="modal-close"
                onClick={() => setShowStudentModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="student-list">
              {selectedDateStudents.length === 0 ? (
                <p className="placeholder">No students enrolled</p>
              ) : (
                selectedDateStudents.map(record => (
                  <div key={record.id} className="student-marking-row">
                    <div className="student-info">
                      <div className="student-name">{record.student.full_name}</div>
                      <div className="student-id">{record.student.username}</div>
                    </div>
                    <select
                      value={studentStates[record.id] || record.status}
                      onChange={(e) => handleMarkAttendance(record.id, e.target.value)}
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

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowStudentModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSaveMarks}
                disabled={loading || Object.keys(studentStates).length === 0}
              >
                {loading ? 'Saving...' : 'Save Marks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
