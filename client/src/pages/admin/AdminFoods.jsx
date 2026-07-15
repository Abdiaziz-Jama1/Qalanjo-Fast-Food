import { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX } from 'react-icons/fi';

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', category: '', ingredients: '', tags: '', isAvailable: true, isFeatured: false, preparationTime: '15' });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => { API.get('/foods/manage').then(res => setFoods(res.data.foods)); };
  useEffect(() => { load(); API.get('/categories').then(res => setCategories(res.data.categories)); }, []);

  const openModal = (food = null) => {
    if (food) {
      setEditing(food);
      setForm({ name: food.name, description: food.description, price: String(food.price), discountPrice: String(food.discountPrice || ''), category: food.category?._id || '', ingredients: food.ingredients?.join(', ') || '', tags: food.tags?.join(', ') || '', isAvailable: food.isAvailable, isFeatured: food.isFeatured, preparationTime: String(food.preparationTime) });
      setImages(food.images || []);
    } else {
      setEditing(null);
      setForm({ name: '', description: '', price: '', discountPrice: '', category: '', ingredients: '', tags: '', isAvailable: true, isFeatured: false, preparationTime: '15' });
      setImages([]);
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const res = await API.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages(prev => [...prev, ...res.data.images]);
      toast.success('Images uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index) => {
    const img = images[index];
    try {
      await API.delete('/upload', { data: { public_id: img.public_id } });
      setImages(prev => prev.filter((_, i) => i !== index));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, preparationTime: Number(form.preparationTime), ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean), tags: form.tags.split(',').map(s => s.trim()).filter(Boolean), images };
    try {
      if (editing) { await API.put(`/foods/${editing._id}`, data); toast.success('Food updated'); }
      else { await API.post('/foods', data); toast.success('Food created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food?')) return;
    try { await API.delete(`/foods/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Foods</h1>
        <button onClick={() => openModal()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"><FiPlus /> Add Food</button>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl border overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium">Image</th><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Category</th><th className="text-left px-4 py-3 font-medium">Price</th><th className="text-left px-4 py-3 font-medium">Available</th><th className="text-left px-4 py-3 font-medium">Featured</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody>{foods.map(food => (
              <tr key={food._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {food.images?.[0]?.url ? (
                    <img src={food.images[0].url} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><FiImage /></div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{food.name}</td>
                <td className="px-4 py-3 text-gray-500">{food.category?.name}</td>
                <td className="px-4 py-3 text-primary font-semibold">{formatPrice(food.price)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{food.isAvailable ? 'Yes' : 'No'}</span></td>
                <td className="px-4 py-3">{food.isFeatured ? '⭐' : ''}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => openModal(food)} className="p-1.5 hover:bg-gray-100 rounded-lg mr-1"><FiEdit2 /></button><button onClick={() => handleDelete(food._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><FiTrash2 /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {foods.length === 0 && <p className="text-center text-gray-500 py-8">No foods found</p>}
        {foods.map(food => (
          <div key={food._id} className="bg-white rounded-xl border p-4">
            <div className="flex items-start gap-3">
              {food.images?.[0]?.url ? (
                <img src={food.images[0].url} alt={food.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0"><FiImage /></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium truncate">{food.name}</p>
                  <span className="text-primary font-semibold text-sm shrink-0">{formatPrice(food.price)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{food.category?.name}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{food.isAvailable ? 'Available' : 'Unavailable'}</span>
                  {food.isFeatured && <span className="text-xs">⭐ Featured</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
              <button onClick={() => openModal(food)} className="p-2 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-1"><FiEdit2 /> Edit</button>
              <button onClick={() => handleDelete(food._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg text-sm flex items-center gap-1"><FiTrash2 /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Food' : 'Add Food'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img.url} alt="" className="w-20 h-20 rounded-lg object-cover border" />
                  <button type="button" onClick={() => handleRemoveImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><FiX className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="food-images" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
              <FiImage className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Add Images'}
            </button>
          </div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Food Name" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" required step="0.01" className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            <input type="number" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} placeholder="Discount Price" step="0.01" className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            <input type="number" value={form.preparationTime} onChange={e => setForm({ ...form, preparationTime: e.target.value })} placeholder="Prep Time (min)" className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="Ingredients (comma separated)" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="rounded text-primary" /> Available</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded text-primary" /> Featured</label>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
