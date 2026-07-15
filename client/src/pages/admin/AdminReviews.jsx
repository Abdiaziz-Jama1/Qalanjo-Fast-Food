import { useState, useEffect } from 'react';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import toast from 'react-hot-toast';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const load = () => API.get('/reviews').then(res => setReviews(res.data.reviews));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await API.put(`/reviews/${id}/approve`); toast.success('Approved'); load(); } catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete review?')) return;
    try { await API.delete(`/reviews/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Reviews</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium">User</th><th className="text-left px-4 py-3 font-medium">Food</th><th className="text-left px-4 py-3 font-medium">Rating</th><th className="text-left px-4 py-3 font-medium">Comment</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
          <tbody>{reviews.map(review => (
            <tr key={review._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{review.user?.name}</td>
              <td className="px-4 py-3 text-gray-500">{review.food?.name}</td>
              <td className="px-4 py-3"><StarRating rating={review.rating} /></td>
              <td className="px-4 py-3 max-w-xs truncate">{review.comment}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{review.isApproved ? 'Approved' : 'Pending'}</span></td>
              <td className="px-4 py-3 text-right">
                {!review.isApproved && <button onClick={() => approve(review._id)} className="p-1.5 hover:bg-green-50 text-green-500 rounded-lg mr-1"><FiCheck /></button>}
                <button onClick={() => remove(review._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><FiTrash2 /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        </div>
        {reviews.length === 0 && <p className="text-center text-gray-500 py-8">No reviews yet</p>}
      </div>
    </div>
  );
}
