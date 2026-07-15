import { useState, useEffect } from 'react';
import API from '../../services/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sortOrder: '0' });

  const load = () => API.get('/categories/all').then(res => setCategories(res.data.categories));
  useEffect(() => { load(); }, []);

  const openModal = (cat = null) => {
    if (cat) { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', sortOrder: String(cat.sortOrder || 0) }); }
    else { setEditing(null); setForm({ name: '', description: '', sortOrder: '0' }); }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, sortOrder: Number(form.sortOrder) };
    try {
      if (editing) { await API.put(`/categories/${editing._id}`, data); toast.success('Updated'); }
      else { await API.post('/categories', data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await API.delete(`/categories/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
        <button onClick={() => openModal()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"><FiPlus /> Add Category</button>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl border overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Description</th><th className="text-left px-4 py-3 font-medium">Order</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody>{categories.map(cat => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.description}</td>
                <td className="px-4 py-3">{cat.sortOrder}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => openModal(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg mr-1"><FiEdit2 /></button><button onClick={() => handleDelete(cat._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><FiTrash2 /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {categories.length === 0 && <p className="text-center text-gray-500 py-8">No categories found</p>}
        {categories.map(cat => (
          <div key={cat._id} className="bg-white rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{cat.name}</p>
                {cat.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.description}</p>}
              </div>
              <span className="text-xs text-gray-400 shrink-0">Order: {cat.sortOrder}</span>
            </div>
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
              <button onClick={() => openModal(cat)} className="p-2 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-1"><FiEdit2 /> Edit</button>
              <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg text-sm flex items-center gap-1"><FiTrash2 /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category Name" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} placeholder="Sort Order" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
