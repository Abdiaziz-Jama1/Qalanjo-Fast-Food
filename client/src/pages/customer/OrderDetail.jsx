import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import Loader from '../../components/common/Loader';
import { FiArrowLeft } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`).then(res => setOrder(res.data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"><FiArrowLeft /> Back to Orders</Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>{order.status.replace(/_/g, ' ')}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">{item.image ? <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🍽️</div>}</div>
                  <div><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p></div>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
            <p className="text-gray-600 text-sm">{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
            <p className="text-gray-600 text-sm">Phone: {order.shippingAddress.phone}</p>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
            <p className="text-gray-600 text-sm capitalize">{order.paymentMethod.replace(/_/g, ' ')}</p>
            {order.paymentDetails?.provider && <p className="text-gray-600 text-sm capitalize">Provider: {order.paymentDetails.provider}</p>}
          </div>
          {order.notes && <div className="bg-white border rounded-xl p-6"><h3 className="font-semibold text-gray-900 mb-3">Notes</h3><p className="text-gray-600 text-sm">{order.notes}</p></div>}
        </div>
      </div>
    </div>
  );
}
