import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiSave } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', { name: form.name, phone: form.phone });
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    try {
      await API.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <h1 className="text-3xl font-bold mb-8">My <span className="text-primary">Profile</span></h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">{user?.name?.charAt(0)}</div>
        <div><h2 className="text-xl font-semibold">{user?.name}</h2><p className="text-gray-500">{user?.email}</p></div>
      </div>
      <form onSubmit={handleProfile} className="bg-white border rounded-xl p-6 space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900">Personal Information</h3>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
        <input value={form.email} disabled className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"><FiSave /> Save Changes</button>
      </form>
      <form onSubmit={handlePassword} className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Change Password</h3>
        <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} placeholder="Current Password" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
        <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} placeholder="New Password" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
        <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} placeholder="Confirm New Password" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
        <button type="submit" className="bg-secondary hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">Update Password</button>
      </form>
    </div>
  );
}
