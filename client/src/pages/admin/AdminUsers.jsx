import { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => API.get('/users').then(res => setUsers(res.data.users));
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    try { await API.put(`/users/${id}/role`, { role }); toast.success('Role updated'); load(); } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete user?')) return;
    try { await API.delete(`/users/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium">User</th><th className="text-left px-4 py-3 font-medium">Phone</th><th className="text-left px-4 py-3 font-medium">Role</th><th className="text-left px-4 py-3 font-medium">Joined</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
          <tbody>{users.map(user => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3"><p className="font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></td>
              <td className="px-4 py-3 text-gray-500">{user.phone || '-'}</td>
              <td className="px-4 py-3">
                <select onChange={e => updateRole(user._id, e.target.value)} value={user.role} className="border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-primary outline-none">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-4 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right"><button onClick={() => deleteUser(user._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><FiTrash2 /></button></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
