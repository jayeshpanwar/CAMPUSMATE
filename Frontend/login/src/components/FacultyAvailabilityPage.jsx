import React, { useEffect, useMemo, useState } from 'react';
import {
  createLeaveRequest,
  getActiveLeaveRequests,
  getAllFacultyAvailability,
  getMyFacultyAvailability,
  getMyLeaveRequests,
  updateMyFacultyAvailability,
} from './api';

const leaveTypeOptions = [
  { value: 'medical', label: 'Medical Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'earned', label: 'Earned Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'sabbatical', label: 'Sabbatical' },
  { value: 'conference', label: 'Conference Leave' },
  { value: 'other', label: 'Other Leave' },
];

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '-';
  if (startDate === endDate) return new Date(startDate).toLocaleDateString();
  return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
};

const FacultyAvailabilityPage = ({ mode = 'student' }) => {
  const isFacultyMode = mode === 'faculty';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [myAvailability, setMyAvailability] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);

  const [allAvailability, setAllAvailability] = useState([]);
  const [activeLeaves, setActiveLeaves] = useState([]);

  const [availabilityForm, setAvailabilityForm] = useState({
    is_available_on_campus: true,
    on_campus_start_time: '09:00',
    on_campus_end_time: '17:00',
    on_campus_location: '',
    on_campus_notes: '',
    is_on_leave: false,
  });

  const [leaveForm, setLeaveForm] = useState({
    leave_type: 'casual',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const clearAlertsSoon = () => {
    window.setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  const loadFacultyData = async () => {
    setLoading(true);
    setError('');
    try {
      const [availabilityRes, leavesRes] = await Promise.all([
        getMyFacultyAvailability(),
        getMyLeaveRequests(),
      ]);

      const availability = availabilityRes.data || null;
      const leaves = leavesRes.data || [];

      setMyAvailability(availability);
      setMyLeaves(leaves);

      if (availability) {
        setAvailabilityForm({
          is_available_on_campus: Boolean(availability.is_available_on_campus),
          on_campus_start_time: availability.on_campus_start_time || '09:00',
          on_campus_end_time: availability.on_campus_end_time || '17:00',
          on_campus_location: availability.on_campus_location || '',
          on_campus_notes: availability.on_campus_notes || '',
          is_on_leave: Boolean(availability.is_on_leave),
        });
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load faculty availability.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async () => {
    setLoading(true);
    setError('');
    try {
      const [availabilityRes, leavesRes] = await Promise.all([
        getAllFacultyAvailability(),
        getActiveLeaveRequests(),
      ]);
      setAllAvailability(availabilityRes.data || []);
      setActiveLeaves(leavesRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load faculty status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFacultyMode) {
      loadFacultyData();
    } else {
      loadStudentData();
    }
  }, [isFacultyMode]);

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...availabilityForm,
        is_on_leave: false,
      };
      const response = await updateMyFacultyAvailability(payload);
      setMyAvailability(response.data || null);
      setSuccess('Cabin availability updated.');
      clearAlertsSoon();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to update availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await createLeaveRequest(leaveForm);
      setSuccess('Leave added successfully. Students can now see this leave.');
      setLeaveForm({
        leave_type: 'casual',
        start_date: '',
        end_date: '',
        reason: '',
      });
      await loadFacultyData();
      clearAlertsSoon();
    } catch (err) {
      const payload = err?.response?.data;
      setError(
        payload?.start_date?.[0] ||
          payload?.end_date?.[0] ||
          payload?.detail ||
          'Failed to add leave.'
      );
    } finally {
      setLoading(false);
    }
  };

  const latestLeaveByFacultyId = useMemo(() => {
    const map = new Map();
    activeLeaves.forEach((leave) => {
      if (!leave?.faculty?.id) return;
      const current = map.get(leave.faculty.id);
      if (!current || new Date(leave.start_date) < new Date(current.start_date)) {
        map.set(leave.faculty.id, leave);
      }
    });
    return map;
  }, [activeLeaves]);

  if (isFacultyMode) {
    return (
      <div className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Faculty Leave & Cabin Availability</h3>
          <p className="text-sm text-gray-500 mt-1">Update your leave dates and when students can find you in your cabin.</p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <form onSubmit={handleLeaveSubmit} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Add Leave</h4>
              <select
                value={leaveForm.leave_type}
                onChange={(e) => setLeaveForm((prev) => ({ ...prev, leave_type: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {leaveTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm((prev) => ({ ...prev, start_date: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
                <input
                  type="date"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm((prev) => ({ ...prev, end_date: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <textarea
                rows={3}
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Reason (optional)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Add Leave'}
              </button>
            </form>

            <form onSubmit={handleAvailabilitySubmit} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Cabin Availability</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="time"
                  value={availabilityForm.on_campus_start_time}
                  onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, on_campus_start_time: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="time"
                  value={availabilityForm.on_campus_end_time}
                  onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, on_campus_end_time: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <input
                type="text"
                value={availabilityForm.on_campus_location}
                onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, on_campus_location: e.target.value }))}
                placeholder="Cabin location (e.g., Block A - Room 204)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                value={availabilityForm.on_campus_notes}
                onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, on_campus_notes: e.target.value }))}
                placeholder="Additional note for students"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={availabilityForm.is_available_on_campus}
                  onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, is_available_on_campus: e.target.checked }))}
                />
                I am available in cabin
              </label>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Availability'}
              </button>
            </form>
          </div>

          <div className="mt-6 border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">My Leave History</h4>
            {myLeaves.length === 0 ? (
              <p className="text-sm text-gray-500">No leave added yet.</p>
            ) : (
              <div className="space-y-2">
                {myLeaves.map((leave) => (
                  <div key={leave.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm border border-gray-100 bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-gray-800">{leave.leave_type} leave</p>
                      <p className="text-gray-500">{formatDateRange(leave.start_date, leave.end_date)}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold uppercase">
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Faculty Leave & Cabin Status</h3>
        <p className="text-sm text-gray-500 mt-1">See which faculty are on leave and who is available in cabin.</p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {loading && <p className="mt-3 text-sm text-gray-500">Loading faculty status...</p>}

        {!loading && allAvailability.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No faculty availability has been published yet.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allAvailability.map((entry) => {
              const faculty = entry.faculty;
              const leave = latestLeaveByFacultyId.get(faculty?.id);
              const isOnLeave = Boolean(entry.is_on_leave) || Boolean(leave);

              return (
                <div key={entry.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{faculty?.first_name || ''} {faculty?.last_name || ''}</p>
                      <p className="text-sm text-gray-500">{faculty?.email}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isOnLeave ? 'bg-red-100 text-red-700' : entry.is_available_on_campus ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {isOnLeave ? 'On Leave' : entry.is_available_on_campus ? 'Available In Cabin' : 'Not Available In Cabin'}
                    </span>
                  </div>

                  {isOnLeave ? (
                    <p className="mt-3 text-sm text-gray-700">
                      Leave duration: {leave ? formatDateRange(leave.start_date, leave.end_date) : 'Dates not specified'}
                    </p>
                  ) : (
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <p>Cabin: {entry.on_campus_location || 'Not provided'}</p>
                      <p>
                        Available till: {entry.on_campus_end_time ? entry.on_campus_end_time.slice(0, 5) : 'Not set'}
                      </p>
                      {entry.on_campus_notes && <p>Note: {entry.on_campus_notes}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default FacultyAvailabilityPage;
