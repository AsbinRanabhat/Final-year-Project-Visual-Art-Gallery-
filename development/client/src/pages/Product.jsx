import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, X, ShoppingCart } from 'lucide-react'; // Added ShoppingCart icon
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; 
import { buildArtFallbackDataUri, setFallbackOnImageError } from '../utils/imageFallback.js';

const allProducts = [
  // ... your existing allProducts array stays exactly as is ...
  {
    id: 1,
    title: "Abstract Ethereal",
    price: 185000,
    category: "Canvas",
    type: "Acrylic on Canvas",
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Golden Hour Study",
    price: 240000,
    category: "Oil",
    type: "Oil Painting",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Minimalist Geometry",
    price: 95000,
    category: "Digital",
    type: "Digital Print",
    img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Urban Silence",
    price: 320000,
    category: "Oil",
    type: "Oil on Linen",
    img: "https://images.unsplash.com/photo-1515405299443-f71bb798f19e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Modern Fluidity",
    price: 120000,
    category: "Canvas",
    type: "Mixed Media",
    img: "https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Nature's Whisper",
    price: 85000,
    category: "Digital",
    type: "Fine Art Print",
    img: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Midnight Monochrome",
    price: 155000,
    category: "Canvas",
    type: "Charcoal on Canvas",
    img: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Alpine Echoes",
    price: 275000,
    category: "Oil",
    type: "Oil on Canvas",
    img: "https://images.unsplash.com/photo-1579783922514-023fa62776c1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Structured Chaos",
    price: 110000,
    category: "Digital",
    type: "Generative Art",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 10,
    title: "Cerulean Depths",
    price: 195000,
    category: "Canvas",
    type: "Impressionist Acrylic",
    img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 11,
    title: "Ancient Textures",
    price: 310000,
    category: "Sculpture",
    type: "Terracotta Relief",
    img: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 12,
    title: "Ephemeral Bloom",
    price: 135000,
    category: "Canvas",
    type: "Mixed Media",
    img: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=800&auto=format&fit=crop"
  }
];

const Product = () => {
  const [activeCategory, setActiveCategory] = useState('All Art');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Destructuring addToCart from the hook
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeCategory !== 'All Art') {
      result = result.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-in fade-in duration-700 body-font">
      <header className="pt-24 pb-12 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-4 block font-bold">
          Curated Private Collection
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6">
          The <span className="italic font-light text-stone-400">Gallery</span>
        </h1>
        <div className="w-16 h-[1px] bg-stone-300 mx-auto"></div>
      </header>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-y border-stone-200 gap-8">
          <div className="flex space-x-8 overflow-x-auto w-full md:w-auto no-scrollbar">
            {['All Art', 'Oil', 'Canvas', 'Digital', 'Sculpture'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-widest transition-all whitespace-nowrap pb-1 border-b-2 ${
                  activeCategory === cat 
                  ? 'text-stone-900 border-stone-900 font-bold' 
                  : 'text-stone-400 border-transparent hover:text-stone-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full md:w-auto">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
              <input 
                type="text"
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-100/50 border-none pl-10 pr-4 py-2 text-xs uppercase tracking-widest focus:ring-1 focus:ring-stone-200 focus:bg-white transition-all outline-none w-48"
              />
              {searchQuery && (
                <X 
                  size={12} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400" 
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>

            <select 
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[10px] uppercase tracking-widest text-stone-600 bg-transparent border border-stone-200 px-4 py-2 hover:bg-white transition-all outline-none cursor-pointer"
            >
              <option value="newest">Sort By: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map((art) => (
              <div key={art.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-8 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  <img 
                    src={art.img || buildArtFallbackDataUri(art.title)} 
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => setFallbackOnImageError(event, art.title)}
                    className="w-full h-full object-cover transition-transform duration-[2s] scale-100 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Link 
                      to={`/product/${art.id}`} 
                      state={{ art }} 
                      className="bg-white text-stone-900 text-[10px] uppercase tracking-[0.3em] px-10 py-4 font-bold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl no-underline"
                    >
                      View Specimen
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between items-start border-t border-stone-100 pt-6">
                  <div className="max-w-[70%]">
                    <h3 className="font-serif text-2xl text-stone-900 leading-tight">
                      {art.title}
                    </h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] mt-3 font-bold">
                      {art.type}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-stone-900 font-bold mb-4">
                      रू {art.price.toLocaleString()}
                    </p>
                    
                    {/* CHANGED: Text updated to 'Add to Cart' and ensuring addToCart logic works */}
                    <button 
                      onClick={() => addToCart(art)}
                      className="group/btn relative overflow-hidden border border-stone-900 px-4 py-2 transition-all duration-300 hover:bg-stone-900 active:scale-95"
                    >
                      <span className="relative z-10 inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-stone-900 group-hover/btn:text-white transition-colors">
                        <ShoppingCart size={10} /> Add to Cart
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif italic text-stone-400 text-xl">No masterpieces found matching your criteria.</p>
            <button 
              onClick={() => {setActiveCategory('All Art'); setSearchQuery('');}}
              className="mt-6 text-[10px] uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1"
            >
              Reset Search
            </button>
          </div>
        )}
      </section>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 pb-32 flex justify-center">
        <nav className="flex items-center gap-12 border-t border-stone-100 pt-16 w-full justify-center">
          <button className="text-stone-300 text-[10px] uppercase tracking-widest disabled:opacity-50" disabled>Previous</button>
          <div className="flex gap-6">
            <span className="text-stone-900 text-[10px] font-bold border-b border-stone-900">01</span>
            <span className="text-stone-400 text-[10px] hover:text-stone-900 cursor-pointer transition-colors">02</span>
          </div>
          <button className="text-stone-900 text-[10px] uppercase tracking-widest hover:tracking-[0.3em] transition-all">Next</button>
        </nav>
      </div>
    </div>
  );
};

export default Product;
