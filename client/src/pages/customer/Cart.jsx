import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const deliveryFee = 3000;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <EmptyState icon={<FiShoppingBag />} title="Your cart is empty" description="Add some delicious dishes from our menu" action={<Link to="/menu" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Browse Menu</Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      <Link to="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"><FiArrowLeft /> Continue Shopping</Link>
      <h1 className="text-3xl font-bold mb-8">Shopping <span className="text-primary">Cart</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="bg-white border rounded-xl p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🍽️</div>}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-primary font-medium">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100"><FiMinus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100"><FiPlus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="text-right font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-xl p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({itemCount} items)</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span>{formatPrice(deliveryFee)}</span></div>
            <div className="border-t pt-3 flex justify-between font-semibold text-lg"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
          <Link to={user ? '/checkout' : '/login'} className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-lg font-semibold mt-6 transition-colors">
            {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
          </Link>
        </div>
      </div>
    </div>
  );
}
