'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/UI/dropdown-menu';
import {
  type AdminUser,
  type UserRole,
  viewUsers,
  createUserAccount,
  toggleUserStatus,
  resetUserPassword,
  assignRole,
  revokeRole,
} from '@/lib/adminUsers';

// Only allow toggling Instructor role via combobox; default role is Student
const togglableRole: UserRole = 'Instructor';

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<UserRole[]>(['Student']);
  const [lastTempPassword, setLastTempPassword] = useState<string | null>(null);

  const reload = () => {
    setUsers(viewUsers(roleFilter || undefined));
  };

  useEffect(() => {
    reload();
  }, [roleFilter]);

  const onCreate = () => {
    if (!name.trim() || !email.trim()) {
      alert('Please input name and email');
      return;
    }
    createUserAccount({ name: name.trim(), email: email.trim(), roles });
    setShowCreate(false);
    setName('');
    setEmail('');
    setRoles(['Student']);
    reload();
  };

  const onToggleStatus = (id: number) => {
    toggleUserStatus(id);
    reload();
  };

  const onResetPassword = (id: number) => {
    const res = resetUserPassword(id);
    setLastTempPassword(res?.tempPassword ?? null);
    if (res) alert(`Temporary password for user ${id}: ${res.tempPassword}`);
  };

  const onAssignRole = (id: number, role: UserRole) => {
    assignRole(id, role);
    reload();
  };

  const onRevokeRole = (id: number, role: UserRole) => {
    revokeRole(id, role);
    reload();
  };

  const toggleRoleInCreate = (role: UserRole) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  return (
    <div className="px-12 py-8 bg-[#f5f5f5] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-2xl text-[#333]">User Management</h1>
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter((e.target.value || '') as UserRole | '')}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All roles</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
          <button onClick={() => setShowCreate(true)} className="bg-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm">Create user</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {u.roles.map((r) => (
                      <span key={r} className="bg-gray-100 px-2 py-1 rounded text-xs">{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={u.active ? 'text-green-600' : 'text-red-600'}>{u.active ? 'Active' : 'Disabled'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => onToggleStatus(u.id)} className="border px-3 py-1 rounded">{u.active ? 'Disable' : 'Enable'}</button>
                    <button onClick={() => onResetPassword(u.id)} className="border px-3 py-1 rounded">Reset Password</button>
                    {/* Assign/Revoke Instructor via dropdown */}
                    <div className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="border px-3 py-1 rounded text-xs">Role: {u.roles[0]}</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white shadow-lg border rounded-lg w-40">
                          <DropdownMenuItem
                            onClick={() => onRevokeRole(u.id, togglableRole)}
                            className="hover:bg-gray-100 px-3 py-2 cursor-pointer text-xs"
                          >
                            Student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAssignRole(u.id, 'Instructor')}
                            className="hover:bg-gray-100 px-3 py-2 cursor-pointer text-xs"
                          >
                            Instructor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>No users</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-[640px] max-w-full p-6">
            <h3 className="text-xl font-semibold text-[#333] mb-4">Create User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border rounded-md px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border rounded-md px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Role</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="border rounded-md px-3 py-2 text-sm">{roles[0]}</button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white shadow-lg border rounded-lg w-40">
                    <DropdownMenuItem
                      onClick={() => setRoles(['Student'])}
                      className="hover:bg-gray-100 px-3 py-2 cursor-pointer text-sm"
                    >
                      Student
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRoles(['Instructor'])}
                      className="hover:bg-gray-100 px-3 py-2 cursor-pointer text-sm"
                    >
                      Instructor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowCreate(false); setName(''); setEmail(''); setRoles(['Student']); }} className="border px-4 py-2 rounded-full text-sm">Cancel</button>
              <button onClick={onCreate} className="bg-[#4ECDC4] text-white px-5 py-2 rounded-full text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
