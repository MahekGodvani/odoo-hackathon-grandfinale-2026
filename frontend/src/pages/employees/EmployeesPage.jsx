import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmployeeFormModal from './EmployeeFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { employeeApi } from '../../api/employeeApi';
import { Plus, LayoutList, LayoutGrid, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';

/**
 * PEOPLEPAY360 - EMPLOYEES MODULE
 * Features List View & Kanban View toggle with filters and full CRUD actions.
 */
const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  
  // Filter state
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeApi.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employeeApi.deleteEmployee(deleteTarget.id);
      setToastMessage(`Employee ${deleteTarget.name} removed successfully.`);
      fetchEmployees();
    } catch (err) {
      console.error('Delete employee error', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    if (deptFilter !== 'All' && emp.department !== deptFilter) return false;
    if (statusFilter !== 'All' && emp.status !== statusFilter) return false;
    if (typeFilter !== 'All' && emp.type !== typeFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (row) => {
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`;
        return (
          <div className="flex items-center space-x-3">
            <img 
              src={row.avatar || fallbackAvatar} 
              alt={row.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackAvatar;
              }}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs" 
            />
            <div>
              <Link to={`/employees/${row.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                {row.name}
              </Link>
              <p className="text-xs text-slate-400">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    { 
      header: 'Employee ID', 
      accessor: 'code', 
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/80">
          {r.code || r.employee_code || (r.rawId ? `EMP-${1000 + Number(r.rawId)}` : (r.id ? `EMP-${r.id}` : 'EMP-1001'))}
        </span>
      ) 
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Position', accessor: 'position' },
    { header: 'Manager', accessor: 'manager' },
    { header: 'Working Schedule', accessor: 'scheduleName', render: (r) => <span className="text-xs text-slate-600">{r.scheduleName || 'Standard Full-Time'}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            title="View Details Hub"
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedEmp(row);
              setIsFormOpen(true);
            }}
            title="Edit Employee"
            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete Employee"
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner label="Loading Employee Directory..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage employees, positions, schedules, and active contracts."
        breadcrumbs={[{ label: 'Employees' }]}
        actions={
          <div className="flex items-center space-x-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setSelectedEmp(null);
                setIsFormOpen(true);
              }}
            >
              New Employee
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Filter By:</span>
          
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
          </select>
        </div>

        <div className="text-slate-500 text-xs">
          Showing <span className="font-bold text-slate-800">{filteredEmployees.length}</span> Employees
        </div>
      </div>

      {/* VIEW MODES */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredEmployees}
          searchPlaceholder="Search employees by name or email..."
          searchField="name"
        />
      ) : (
        /* KANBAN CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`} 
                      alt={emp.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`;
                      }}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs" 
                    />
                    <div>
                      <Link to={`/employees/${emp.id}`} className="font-bold text-slate-800 hover:text-indigo-600 text-sm block">
                        {emp.name}
                      </Link>
                      <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {emp.code || emp.employee_code || (emp.rawId ? `EMP-${1000 + Number(emp.rawId)}` : `EMP-${emp.id}`)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                  <p className="font-semibold text-indigo-700">{emp.position}</p>
                  <p className="text-slate-500">Dept: <span className="font-medium text-slate-700">{emp.department}</span></p>
                  <div className="flex items-center text-slate-400 gap-1 mt-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center text-slate-400 gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{emp.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">{emp.type}</span>
                <Link
                  to={`/employees/${emp.id}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View Operational Hub →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New / Edit Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        employee={selectedEmp}
        onSuccess={() => {
          setIsFormOpen(false);
          setToastMessage(selectedEmp ? 'Employee updated successfully' : 'New employee created and added to directory');
          fetchEmployees();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee Record"
        message={`Are you sure you want to delete ${deleteTarget?.name}? Associated contract records will also be removed.`}
        confirmText="Delete Employee"
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default EmployeesPage;
