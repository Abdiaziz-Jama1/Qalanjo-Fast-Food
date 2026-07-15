import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function FoodDetail() {
  const { slug } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    API.get(`/foods/${slug}`)
      .then(async (foodRes) => {
        setFood(foodRes.data.food);
        try {
          const reviewRes = await API.get(`/reviews/food/${foodRes.data.food._id}`);
          setReviews(reviewRes.data.reviews);
        } catch { /* reviews unavailable */ }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', { food: food._id, rating, comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      const res = await API.get(`/reviews/food/${food._id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;
  if (!food) return <div className="text-center py-16 text-gray-500">Food not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      <Link to="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"><FiArrowLeft /> Back to Menu</Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl overflow-hidden h-80 lg:h-96">
          {food.images?.[0]?.url ? (
            <img src={food.images[0].url} alt={food.name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
          )}
        </div>
        <div>
          <span className="text-primary font-medium text-sm">{food.category?.name}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{food.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={food.ratings?.average || 0} size="w-5 h-5" />
            <span className="text-gray-500">({food.ratings?.count || 0} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(food.price)}</span>
            {food.discountPrice > 0 && <span className="text-lg text-gray-400 line-through">{formatPrice(food.discountPrice)}</span>}
          </div>
          <p className="text-gray-600 mb-6">{food.description}</p>
          {food.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">{food.ingredients.map(i => <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">{i}</span>)}</div>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">Preparation time: {food.preparationTime} min</p>
          {food.isAvailable && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-100"><FiMinus /></button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-gray-100"><FiPlus /></button>
              </div>
              <button onClick={() => { addItem(food, quantity); toast.success(`Added ${quantity} to cart`); }} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {user ? (
          <form onSubmit={handleReview} className="bg-white border rounded-xl p-6 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => <button key={s} type="button" onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? 'text-primary' : 'text-gray-300'}`}>★</button>)}</div>
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary outline-none" rows={3} />
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">Submit Review</button>
          </form>
        ) : <p className="text-gray-500 mb-6"><Link to="/login" className="text-primary hover:underline">Sign in</Link> to leave a review.</p>}

        <div className="space-y-4">
          {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : reviews.map(review => (
            <div key={review._id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">{review.user?.name?.charAt(0)}</div>
                <div><p className="font-medium text-gray-900">{review.user?.name}</p><StarRating rating={review.rating} /></div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
