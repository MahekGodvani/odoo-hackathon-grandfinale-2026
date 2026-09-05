import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { useAuth, ROLES } from '../../context/AuthContext';
import { attendanceApi } from '../../api/attendanceApi';
import { employeeApi } from '../../api/employeeApi';
import { Plus, Clock, Edit, CheckCircle } from 'lucide-react';

/**
 * PEOPLEPAY360 - ATTENDANCE MODULE
 * Role aware: Employees view only their records; HR users view and edit all logs.
 */
const AttendancePage = () => {
  const { user, role } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '18:00',
    notes: 'Regular check-in',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // If regular Employee role, filter attendance to their own ID
      const params = role === ROLES.EMPLOYEE && user ? { employeeId: user.id } : {};
      const [attRes, empRes] = await Promise.all([
        attendanceApi.getAttendance(params),
        employeeApi.getEmployees(),
      ]);
      setAttendance(attRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error fetching attendance data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user]);

  // Live Worked Hours Calculator helper
  const calculateWorkedHours = (cIn, cOut) => {
    if (!cIn || !cOut) return 0;
    const [iH, iM] = cIn.split(':').map(Number);
    const [oH, oM] = cOut.split(':').map(Number);
    const minutes = (oH * 60 + oM) - (iH * 60 + iM) - 60; // minus 1 hour lunch break
    return Math.max(0, Math.round((minutes / 60) * 100) / 100);
  };

  const calculatedHours = calculateWorkedHours(formData.checkIn, formData.checkOut);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    if (employees.length > 0) {
      setFormData({
        employeeId: employees[0].id,
        date: new Date().toISOString().split('T')[0],
        checkIn: '09:00',
        checkOut: '18:00',
        notes: 'Regular check-in',
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    setFormData({
      employeeId: rec.employeeId,
      date: rec.date,
      checkIn: rec.checkIn,
      checkOut: rec.checkOut || '18:00',
      notes: rec.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const emp = employees.find((x) => x.id === formData.employeeId);
      const hours = calculateWorkedHours(formData.checkIn, formData.checkOut);
      
      let status = 'Present';
      if (hours > 8) status = 'Overtime';
      if (formData.checkIn > '09:15') status = 'Late';

      const payload = {
        ...formData,
        employeeName: emp ? emp.name : 'Employee',
        workedHours: hours,
        status,
      };

      if (selectedRecord) {
        await attendanceApi.updateAttendance(selectedRecord.id, payload);
        setToastMessage('Attendance record corrected');
      } else {
        await attendanceApi.createAttendance(payload);
        setToastMessage('New attendance entry logged');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving attendance', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Attendance Logs..." />;

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-800">{r.employeeName}</p>
          <span className="font-mono text-[11px] text-slate-400">{r.employeeId}</span>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut', render: (r) => r.checkOut || '--:--' },
    {
      header: 'Worked Hours',
      accessor: 'workedHours',
      render: (r) => <span className="font-bold text-indigo-700">{r.workedHours} hrs</span>
    },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Notes', accessor: 'notes' },
    {
      header: 'Actions',
      render: (r) => (
        <button
          onClick={() => handleOpenEdit(r)}
          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
        >
          <Edit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Daily clock-in logs, overtime tracking, and attendance corrections."
        breadcrumbs={[{ label: 'Attendance' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Log Attendance
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={attendance}
        searchPlaceholder="Search attendance logs..."
        searchField="employeeName"
      />

      {/* LOG / EDIT ATTENDANCE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? `Correct Attendance Log (${selectedRecord.id})` : 'Log Attendance Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            name="employeeId"
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={employees.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))}
          />

          <Input
            label="Attendance Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check In Time"
              type="time"
              required
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
            />
            <Input
              label="Check Out Time"
              type="time"
              required
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
            />
          </div>

          <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Calculated Net Worked Hours:</span>
            <span className="text-lg font-mono font-bold text-indigo-700">{calculatedHours} hrs</span>
          </div>

          <Input
            label="Notes / Remarks"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Approved overtime shift"
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {selectedRecord ? 'Save Correction' : 'Log Attendance'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default AttendancePage;
