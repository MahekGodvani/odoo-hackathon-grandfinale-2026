import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { employeeApi } from '../../api/employeeApi';
import { scheduleApi } from '../../api/scheduleApi';

/**
 * PEOPLEPAY360 - EMPLOYEE FORM MODAL
 */
const EmployeeFormModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    manager: 'Karan Mehta',
    type: 'Full-time',
    scheduleId: 'sch-1',
    scheduleName: 'Standard Full-Time (40h)',
    wage: 50000,
    status: 'Active',
    bankName: 'HDFC Bank',
    accountNo: '',
    ifsc: '',
  });

  const [schedules, setSchedules] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSchedules() {
      try {
        const res = await scheduleApi.getSchedules();
        setSchedules(res.data);
      } catch (err) {
        console.error('Failed to load schedules', err);
      }
    }
    if (isOpen) {
      loadSchedules();
    }
  }, [isOpen]);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || 'Engineering',
        position: employee.position || '',
        manager: employee.manager || 'Karan Mehta',
        type: employee.type || 'Full-time',
        scheduleId: employee.scheduleId || 'sch-1',
        scheduleName: employee.scheduleName || 'Standard Full-Time (40h)',
        wage: employee.wage || 50000,
        status: employee.status || 'Active',
        bankName: employee.bankDetails?.bank || 'HDFC Bank',
        accountNo: employee.bankDetails?.accountNo || '',
        ifsc: employee.bankDetails?.ifsc || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        position: '',
        manager: 'Karan Mehta',
        type: 'Full-time',
        scheduleId: 'sch-1',
        scheduleName: 'Standard Full-Time (40h)',
        wage: 50000,
        status: 'Active',
        bankName: 'HDFC Bank',
        accountNo: '',
        ifsc: '',
      });
    }
  }, [employee, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'scheduleId') {
      const selectedSch = schedules.find((s) => s.id === value);
      setFormData((prev) => ({
        ...prev,
        scheduleId: value,
        scheduleName: selectedSch ? selectedSch.name : prev.scheduleName,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        manager: formData.manager,
        type: formData.type,
        scheduleId: formData.scheduleId,
        scheduleName: formData.scheduleName,
        wage: Number(formData.wage),
        status: formData.status,
        bankDetails: formData.accountNo
          ? { bank: formData.bankName, accountNo: formData.accountNo, ifsc: formData.ifsc }
          : null,
      };

      if (employee) {
        await employeeApi.updateEmployee(employee.id, payload);
      } else {
        await employeeApi.createEmployee(payload);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving employee', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? `Edit Employee (${employee.id})` : 'New Employee Onboarding'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Rahul Patel"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="rahul@company.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Job Position"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            placeholder="Software Engineer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Department"
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
            options={['Engineering', 'Sales', 'Human Resources', 'Finance']}
          />
          <Select
            label="Employee Type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            options={['Full-time', 'Part-time']}
          />
          <Select
            label="Status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            options={['Active', 'On Leave', 'Inactive']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Working Schedule"
            name="scheduleId"
            required
            value={formData.scheduleId}
            onChange={handleChange}
            options={schedules.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Input
            label="Monthly Wage (₹)"
            name="wage"
            type="number"
            required
            value={formData.wage}
            onChange={handleChange}
            placeholder="50000"
            helperText="Creates initial active contract"
          />
        </div>

        {/* Bank Details Collapsible / Sub-section */}
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Bank Details (Payroll Transfer)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="HDFC Bank"
            />
            <Input
              label="Account Number"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              placeholder="501009988112"
            />
            <Input
              label="IFSC Code"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              placeholder="HDFC0001234"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {employee ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
