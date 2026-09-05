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
import { ROLES } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { Plus, UserCheck, ShieldCheck, Edit, Power } from 'lucide-react';

/**
 * PEOPLEPAY360 - SYSTEM USERS & ROLE MANAGEMENT (ADMIN ONLY)
 */
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.HR_PAYROLL_MANAGER,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '', role: ROLES.HR_PAYROLL_MANAGER });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setFormData({ name: u.name, email: u.email, role: u.role });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (u) => {
    try {
      await userApi.toggleUserStatus(u.id);
      setToastMessage(`User ${u.name} status updated`);
      fetchUsers();
    } catch (err) {
      console.error('Status toggle error', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        await userApi.updateUserRole(selectedUser.id, formData.role);
        setToastMessage(`Updated role for ${selectedUser.name}`);
      } else {
        await userApi.createUser(formData);
        setToastMessage(`Created new user account for ${formData.name}`);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading System Users..." />;

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center space-x-3">
          <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
          <div>
            <p className="font-bold text-slate-800">{r.name}</p>
            <p className="text-xs text-slate-400">{r.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'System Role',
      accessor: 'role',
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          {r.role}
        </span>
      )
    },
    { header: 'Account Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenEdit(r)}
            title="Edit Role"
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(r)}
            title={r.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
            className={`p-1 rounded ${r.status === 'Active' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Users & Role Management"
        subtitle="Control user login credentials, assign permissions, and activate/deactivate accounts."
        breadcrumbs={[{ label: 'Users' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            New System User
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search system users..."
        searchField="name"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? `Edit Role for ${selectedUser.name}` : 'Create System User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            disabled={!!selectedUser}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Priya Shah"
          />

          <Input
            label="Email Address"
            type="email"
            required
            disabled={!!selectedUser}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="priya@company.com"
          />

          <Select
            label="System Role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={Object.values(ROLES)}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {selectedUser ? 'Update Role' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default UsersPage;
