import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { addItem } = useCart();

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    API.get('/categories').then(res => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;
    API.get('/foods', { params })
      .then(res => { setFoods(res.data.foods); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  }, [activeCategory, page, search]);

  const handleCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our <span className="text-primary">Menu</span></h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search dishes..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => handleCategory('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        {categories.map(cat => (
          <button key={cat._id} onClick={() => handleCategory(cat.slug)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.slug ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : foods.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No dishes found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map(food => (
              <Link key={food._id} to={`/menu/${food.slug}`} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {food.images?.[0]?.url ? (
                    <img src={food.images[0].url} alt={food.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  )}
                  {!food.isAvailable && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">Unavailable</div>}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-medium mb-1">{food.category?.name}</p>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{food.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{food.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={food.ratings?.average || 0} />
                    <span className="text-xs text-gray-500">({food.ratings?.count || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPrice(food.price)}</span>
                    <button onClick={e => { e.preventDefault(); addItem(food); toast.success('Added to cart'); }} className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors">
                      <FiShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg font-medium ${p === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
