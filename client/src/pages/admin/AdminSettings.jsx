import { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/settings').then(res => { setSettings(res.data.settings); setLoading(false); }); }, []);

  const handleChange = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleHoursChange = (index, field, value) => {
    const updated = [...settings.openingHours];
    updated[index] = { ...updated[index], [field]: value };
    setSettings(prev => ({ ...prev, openingHours: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.put('/settings', settings); toast.success('Settings saved'); } catch { toast.error('Failed'); }
  };

  if (loading || !settings) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Restaurant Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">General Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1">Restaurant Name</label><input value={settings.restaurantName} onChange={e => handleChange('restaurantName', e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Tagline</label><input value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1">Phone</label><input value={settings.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Email</label><input value={settings.email} onChange={e => handleChange('email', e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Address</label><input value={settings.address} onChange={e => handleChange('address', e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1">Delivery Fee (UGX)</label><input type="number" step="100" value={settings.deliveryFee} onChange={e => handleChange('deliveryFee', Number(e.target.value))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Tax Rate (e.g. 0.1 for 10%)</label><input type="number" step="0.01" value={settings.taxRate} onChange={e => handleChange('taxRate', Number(e.target.value))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Opening Hours</h3>
          <div className="space-y-3">
            {settings.openingHours?.map((h, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-full sm:w-28 text-sm font-medium text-gray-700">{h.day}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="time" value={h.open} onChange={e => handleHoursChange(i, 'open', e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none" disabled={h.isClosed} />
                  <span className="text-gray-400">to</span>
                  <input type="time" value={h.close} onChange={e => handleHoursChange(i, 'close', e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none" disabled={h.isClosed} />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={h.isClosed} onChange={e => handleHoursChange(i, 'isClosed', e.target.checked)} className="rounded text-primary" /> Closed</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1">Facebook</label><input value={settings.socialLinks?.facebook || ''} onChange={e => handleChange('socialLinks', { ...settings.socialLinks, facebook: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Instagram</label><input value={settings.socialLinks?.instagram || ''} onChange={e => handleChange('socialLinks', { ...settings.socialLinks, instagram: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
            <div><label className="text-sm text-gray-600 block mb-1">Twitter</label><input value={settings.socialLinks?.twitter || ''} onChange={e => handleChange('socialLinks', { ...settings.socialLinks, twitter: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" /></div>
          </div>
        </div>

        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"><FiSave /> Save Settings</button>
      </form>
    </div>
  );
}
