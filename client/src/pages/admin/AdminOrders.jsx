import { useState, useEffect, Fragment } from 'react';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiChevronDown, FiChevronRight, FiMapPin, FiPhone } from 'react-icons/fi';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', preparing: 'bg-purple-100 text-purple-800', out_for_delivery: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState({});

  const load = () => { const params = filter ? { status: filter } : {}; API.get('/orders', { params }).then(res => setOrders(res.data.orders)); };
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try { await API.put(`/orders/${id}/status`, { status }); toast.success('Status updated'); load(); } catch { toast.error('Failed'); }
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const renderExpandedContent = (order) => (
    <div className="space-y-2 ml-6">
      {order.items?.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          {item.image ? (
            <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No img</div>
          )}
          <span className="font-medium flex-1">{item.name}</span>
          <span className="text-gray-500">x{item.quantity}</span>
          <span className="text-primary font-medium">{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}
      {order.notes && <p className="text-xs text-gray-500 mt-2 italic">Note: {order.notes}</p>}
      {order.shippingAddress && (
        <div className="flex items-start gap-2 text-xs text-gray-600 mt-2 bg-white rounded-lg p-2 border">
          <FiMapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}{order.shippingAddress.zip ? `, ${order.shippingAddress.zip}` : ''}</p>
            {order.shippingAddress.phone && <p className="flex items-center gap-1 mt-1"><FiPhone className="w-3 h-3" /> {order.shippingAddress.phone}</p>}
          </div>
        </div>
      )}
      <div className="flex gap-4 text-xs text-gray-500 mt-2 pt-2 border-t">
        <span>Subtotal: {formatPrice(order.subtotal)}</span>
        <span>Delivery: {formatPrice(order.deliveryFee)}</span>
        <span className="font-semibold text-gray-900">Total: {formatPrice(order.total)}</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-sm">
          <option value="">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl border overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium w-8"></th><th className="text-left px-4 py-3 font-medium">Order</th><th className="text-left px-4 py-3 font-medium">Customer</th><th className="text-left px-4 py-3 font-medium">Items</th><th className="text-left px-4 py-3 font-medium">Total</th><th className="text-left px-4 py-3 font-medium">Payment</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium">Action</th></tr></thead>
            <tbody>{orders.map(order => (
              <Fragment key={order._id}>
                <tr className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                  <td className="px-4 py-3 text-gray-400">{expanded[order._id] ? <FiChevronDown /> : <FiChevronRight />}</td>
                  <td className="px-4 py-3 text-xs font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">{order.user?.name || 'Guest'}</td>
                  <td className="px-4 py-3 text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 capitalize text-xs">{order.paymentMethod?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status?.replace(/_/g, ' ')}</span></td>
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <select onChange={e => updateStatus(order._id, e.target.value)} value={order.status} className="border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-primary outline-none">
                      {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                </tr>
                {expanded[order._id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="px-4 py-3">{renderExpandedContent(order)}</td>
                  </tr>
                )}
              </Fragment>
            ))}</tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="text-center text-gray-500 py-8">No orders found</p>}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {orders.length === 0 && <p className="text-center text-gray-500 py-8">No orders found</p>}
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(order._id)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs font-mono text-gray-500">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="font-medium text-sm">{order.user?.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status?.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} • {order.paymentMethod?.replace(/_/g, ' ')}</span>
                {expanded[order._id] ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
              </div>
            </div>
            {expanded[order._id] && (
              <div className="px-4 pb-4 border-t">
                {renderExpandedContent(order)}
                <div className="mt-3 pt-3 border-t" onClick={e => e.stopPropagation()}>
                  <label className="text-xs text-gray-500 block mb-1">Update Status</label>
                  <select onChange={e => updateStatus(order._id, e.target.value)} value={order.status} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
