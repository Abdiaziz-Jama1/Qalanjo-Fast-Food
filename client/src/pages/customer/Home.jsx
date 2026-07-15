import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import { FiArrowRight, FiStar, FiShoppingCart, FiClock, FiTruck, FiShield, FiChevronDown, FiChevronUp, FiPhone } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

const testimonials = [
  { name: 'Sarah K.', role: 'Regular Customer', text: 'The best fast food in Kampala! Every order is fresh and delivered hot. Qalanjo never disappoints.', rating: 5 },
  { name: 'James M.', role: 'Food Blogger', text: 'I have tried many delivery services but Qalanjo stands out. The flavors are authentic and portions are generous.', rating: 5 },
  { name: 'Grace N.', role: 'Busy Mom', text: 'Quick delivery and the kids love it! The burgers are huge and the prices are very fair. My go-to for family meals.', rating: 5 },
  { name: 'David L.', role: 'Office Worker', text: 'Ordering for the whole office has never been easier. Consistent quality every single time. Highly recommended!', rating: 4 },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'We deliver within 30-45 minutes depending on your location. You can track your order status in real time from the app.' },
  { q: 'What payment methods do you accept?', a: 'We accept Mobile Money (MTN and Airtel) as well as cash on delivery (pay at door). More payment options coming soon.' },
  { q: 'Can I customize my order?', a: 'Yes! You can add notes to your order during checkout. For special requests like removing ingredients or extra toppings, just include them in the notes section.' },
  { q: 'What are your opening hours?', a: 'We are open Monday to Thursday from 9am-10pm, Friday and Saturday from 9am-11pm, and Sunday from 10am-9pm.' },
  { q: 'Is there a minimum order amount?', a: 'No minimum order required! However, orders under the delivery fee threshold will incur a small delivery charge of 3,000 UGX.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    API.get('/foods/featured').then(res => setFeatured(res.data.foods));
    API.get('/categories').then(res => setCategories(res.data.categories));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Now delivering in Kampala</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Tasty Food, <br /><span className="text-primary">Delivered Fast</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-md">Freshly prepared meals delivered to your doorstep. Browse our menu, order in seconds, and enjoy hot food at your convenience.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/25">
                  Browse Menu <FiArrowRight />
                </Link>
                <Link to="/contact" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors">
                  Contact Us
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="text-center"><p className="text-2xl font-bold text-primary">15+</p><p className="text-xs text-gray-500">Menu Items</p></div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center"><p className="text-2xl font-bold text-primary">30min</p><p className="text-xs text-gray-500">Avg Delivery</p></div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center"><p className="text-2xl font-bold text-primary">4.8</p><p className="text-xs text-gray-500">Customer Rating</p></div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-primary/20 rounded-3xl -rotate-3" />
                <img src="/hero-food-3.jpg" alt="Delicious food" className="relative w-full h-full object-cover rounded-3xl shadow-2xl" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                <div className="relative w-full h-full items-center justify-center text-9xl hidden rounded-3xl">🍔</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">How It <span className="text-primary">Works</span></h2>
          <p className="text-gray-500 text-center mb-12 max-w-md mx-auto">Ordering from Qalanjo is as easy as 1-2-3</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-surface group hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <FiShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-10 mb-2 relative z-10">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Your Food</h3>
              <p className="text-sm text-gray-500">Browse our menu and pick your favorite dishes. Add them to your cart with one tap.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-surface group hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <FiShield className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-10 mb-2 relative z-10">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Payment</h3>
              <p className="text-sm text-gray-500">Pay securely with Mobile Money or choose cash on delivery. Simple and safe.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-surface group hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <FiTruck className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-10 mb-2 relative z-10">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-500">Your food is prepared fresh and delivered hot to your door in under 30 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our <span className="text-primary">Categories</span></h2>
        <p className="text-gray-500 text-center mb-12">Explore what we have to offer</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map(cat => (
            <Link key={cat._id} to={`/menu?category=${cat.slug}`} className="group text-center p-4 rounded-xl border hover:border-primary hover:shadow-md transition-all bg-white">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">🍽️</span>
              </div>
              <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured <span className="text-primary">Dishes</span></h2>
              <p className="text-gray-500 mt-1">Our most popular picks</p>
            </div>
            <Link to="/menu" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(food => (
              <div key={food._id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {food.images?.[0]?.url ? (
                    <img src={food.images[0].url} alt={food.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-medium mb-1">{food.category?.name}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{food.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={food.ratings?.average || 0} />
                    <span className="text-xs text-gray-500">({food.ratings?.count || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">{formatPrice(food.price)}</span>
                      {food.discountPrice > 0 && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(food.discountPrice)}</span>}
                    </div>
                    <button onClick={() => { addItem(food); toast.success('Added to cart'); }} className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors">
                      <FiShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">What Our <span className="text-primary">Customers</span> Say</h2>
          <p className="text-gray-500 text-center mb-12">Real reviews from real people</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-all">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-gray-500 text-center mb-12">Everything you need to know</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all ${openFaq === i ? 'border-primary shadow-sm' : 'border-gray-200'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? <FiChevronUp className="w-5 h-5 text-primary shrink-0" /> : <FiChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hungry? Don't Wait.</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Order now and get hot, fresh food delivered to your doorstep in minutes.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/menu" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                  Order Now <FiArrowRight />
                </Link>
                <a href="tel:+256700123456" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <FiPhone className="w-4 h-4" /> Call to Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
