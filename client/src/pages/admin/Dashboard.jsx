import { useState, useEffect } from 'react';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import { FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/orders').catch(() => ({ data: { orders: [] } })),
      API.get('/users').catch(() => ({ data: { users: [] } })),
    ]).then(([ordersRes, usersRes]) => {
      const orders = ordersRes.data.orders || [];
      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      setStats({ orders: orders.length, users: usersRes.data.users?.length || 0, revenue });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats.orders, icon: <FiShoppingBag />, color: 'bg-blue-500' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: <FiDollarSign />, color: 'bg-green-500' },
    { label: 'Users', value: stats.users, icon: <FiUsers />, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-3 sm:p-5 border">
            <div className="flex items-center justify-between">
              <div><p className="text-xs sm:text-sm text-gray-500">{card.label}</p><p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{card.value}</p></div>
              <div className={`${card.color} text-white p-2 sm:p-3 rounded-lg`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-4 sm:p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet.</p> : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{order.user?.name || 'Guest'}</p><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                <div className="text-right shrink-0 ml-3"><p className="font-semibold text-primary text-sm sm:text-base">{formatPrice(order.total)}</p><p className="text-xs text-gray-500 capitalize">{order.status}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
