import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deliveryFee = 3000;
  const total = subtotal + deliveryFee;

  const [form, setForm] = useState({
    street: '', city: '', zip: '', phone: user?.phone || '',
    paymentMethod: 'pay_at_door',
    provider: '',
    mobilePhone: '',
    notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: items.map(i => ({ food: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        shippingAddress: { street: form.street, city: form.city, zip: form.zip, phone: form.phone },
        paymentMethod: form.paymentMethod,
        paymentDetails: form.paymentMethod === 'mobile_money' ? { provider: form.provider, transactionId: `MOCK-${Date.now()}`, status: 'pending' } : { status: 'pending' },
        subtotal, deliveryFee, total, notes: form.notes,
      };
      await API.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"><FiArrowLeft /> Back to Cart</Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <input name="street" value={form.street} onChange={handleChange} placeholder="Street Name" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
                <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP Code" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="paymentMethod" value="pay_at_door" checked={form.paymentMethod === 'pay_at_door'} onChange={handleChange} className="text-primary" />
                <div><p className="font-medium">Pay at Door</p><p className="text-sm text-gray-500">Pay when your food arrives</p></div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="paymentMethod" value="mobile_money" checked={form.paymentMethod === 'mobile_money'} onChange={handleChange} className="text-primary" />
                <div><p className="font-medium">Mobile Money</p><p className="text-sm text-gray-500">MTN or Airtel Money</p></div>
              </label>
            </div>
            {form.paymentMethod === 'mobile_money' && (
              <div className="mt-4 space-y-3">
                <select name="provider" value={form.provider} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select Provider</option>
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="airtel">Airtel Money</option>
                </select>
                <input name="mobilePhone" value={form.mobilePhone} onChange={handleChange} placeholder="Mobile Money Phone Number" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
              </div>
            )}
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Notes</h3>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions?" rows={3} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold mt-6 transition-colors">Place Order</button>
        </div>
      </form>
    </div>
  );
}
