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
import { scheduleApi } from '../../api/scheduleApi';
import { Plus, Clock, Edit } from 'lucide-react';

/**
 * PEOPLEPAY360 - WORKING SCHEDULES MODULE
 * Features daily shift pattern setup with instant frontend weekly total hours calculator.
 */
const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const defaultPattern = {
    Monday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
    Tuesday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
    Wednesday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
    Thursday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
    Friday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
    Saturday: { active: false, start: '', end: '', breakMinutes: 0 },
    Sunday: { active: false, start: '', end: '', breakMinutes: 0 },
  };

  const [name, setName] = useState('');
  const [type, setType] = useState('Full-time');
  const [pattern, setPattern] = useState(defaultPattern);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await scheduleApi.getSchedules();
      setSchedules(res.data);
    } catch (err) {
      console.error('Error fetching schedules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Frontend calculation helper for immediate weekly total hours feedback
  const calculateWeeklyHours = (pat) => {
    let totalMinutes = 0;
    Object.values(pat).forEach((day) => {
      if (day.active && day.start && day.end) {
        const [sH, sM] = day.start.split(':').map(Number);
        const [eH, eM] = day.end.split(':').map(Number);
        let durationMinutes = (eH * 60 + eM) - (sH * 60 + sM);
        durationMinutes -= Number(day.breakMinutes || 0);
        if (durationMinutes > 0) totalMinutes += durationMinutes;
      }
    });
    return Math.round((totalMinutes / 60) * 10) / 10;
  };

  const computedWeeklyHours = calculateWeeklyHours(pattern);

  const handleOpenCreate = () => {
    setSelectedSchedule(null);
    setName('');
    setType('Full-time');
    setPattern(defaultPattern);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setSelectedSchedule(sch);
    setName(sch.name);
    setType(sch.type);
    setPattern(sch.pattern || defaultPattern);
    setIsModalOpen(true);
  };

  const handleDayChange = (day, field, value) => {
    setPattern((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        type,
        weeklyHours: computedWeeklyHours,
        pattern,
        status: 'Active',
      };

      if (selectedSchedule) {
        await scheduleApi.updateSchedule(selectedSchedule.id, payload);
        setToastMessage('Schedule updated');
      } else {
        await scheduleApi.createSchedule(payload);
        setToastMessage('New schedule created');
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (err) {
      console.error('Error saving schedule', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Working Schedules..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Working Schedules"
        subtitle="Define weekly shift hours, standard working times, and break durations."
        breadcrumbs={[{ label: 'Working Schedules' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            New Schedule
          </Button>
        }
      />

      <DataTable
        columns={[
          {
            header: 'Schedule Name',
            accessor: 'name',
            render: (r) => (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-slate-800">{r.name}</span>
              </div>
            )
          },
          { header: 'Type', accessor: 'type' },
          {
            header: 'Weekly Hours',
            accessor: 'weeklyHours',
            render: (r) => <span className="font-bold text-indigo-600">{r.weeklyHours}h / week</span>
          },
          { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
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
        ]}
        data={schedules}
      />

      {/* SCHEDULE FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSchedule ? `Edit Schedule (${selectedSchedule.name})` : 'Create Working Schedule'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Schedule Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Full-Time (40h)"
            />
            <Select
              label="Schedule Type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={['Full-time', 'Part-time', 'Shift']}
            />
          </div>

          {/* WEEKLY HOURS LIVE COMPUTED DISPLAY BADGE */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-indigo-900">Total Calculated Weekly Hours</p>
              <p className="text-xs text-indigo-700">Calculated automatically from working days & breaks below</p>
            </div>
            <span className="text-2xl font-extrabold text-indigo-700 font-mono">{computedWeeklyHours}h</span>
          </div>

          {/* WEEKLY PATTERN INPUT TABLE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2">Day</th>
                  <th className="px-3 py-2">Start Time</th>
                  <th className="px-3 py-2">End Time</th>
                  <th className="px-3 py-2">Break (Minutes)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {daysOfWeek.map((day) => {
                  const d = pattern[day] || { active: false, start: '', end: '', breakMinutes: 0 };
                  return (
                    <tr key={day} className={d.active ? 'bg-white' : 'bg-slate-50/50 text-slate-400'}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={d.active}
                          onChange={(e) => handleDayChange(day, 'active', e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{day}</td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          disabled={!d.active}
                          value={d.start}
                          onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                          className="border border-slate-300 rounded px-2 py-1 bg-white disabled:bg-slate-100 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          disabled={!d.active}
                          value={d.end}
                          onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                          className="border border-slate-300 rounded px-2 py-1 bg-white disabled:bg-slate-100 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          disabled={!d.active}
                          value={d.breakMinutes}
                          onChange={(e) => handleDayChange(day, 'breakMinutes', Number(e.target.value))}
                          className="w-20 border border-slate-300 rounded px-2 py-1 bg-white disabled:bg-slate-100 text-xs"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {selectedSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default SchedulesPage;
