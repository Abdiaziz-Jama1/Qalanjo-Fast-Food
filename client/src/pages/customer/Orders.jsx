import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FiPackage } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my').then(res => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <div className="max-w-7xl mx-auto px-4 py-8 pb-32"><EmptyState icon={<FiPackage />} title="No orders yet" description="Start ordering your favorite dishes!" action={<Link to="/menu" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Browse Menu</Link>} /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <h1 className="text-3xl font-bold mb-8">My <span className="text-primary">Orders</span></h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status.replace(/_/g, ' ')}</span>
                <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.items.slice(0, 3).map((item, i) => <span key={i} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.name} x{item.quantity}</span>)}
              {order.items.length > 3 && <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
