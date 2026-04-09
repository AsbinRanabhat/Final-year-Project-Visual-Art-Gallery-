import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { buildArtFallbackDataUri, setFallbackOnImageError } from '../utils/imageFallback.js';

const Home = () => {
  const navigate = useNavigate();

  const featuredArt = [
    {
      id: 1,
      title: "Abstract Ethereal",
      price: "$1,850.00",
      type: "Acrylic on Canvas",
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Golden Hour Study",
      price: "$2,400.00",
      type: "Oil Painting",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Minimalist Geometry",
      price: "$950.00",
      type: "Digital Print",
      img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="animate-in fade-in duration-1000 bg-[#FAF9F6] body-font">
      <section className="relative h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop" 
            alt="Gallery" 
            className="w-full h-full object-cover opacity-10 grayscale"
          />
        </div>

        <div className="text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-6 block body-font">
            Est. 2026 • Private Collection
          </span>
          <h2 className="text-5xl md:text-7xl display-font font-bold text-stone-900 leading-tight mb-10">
            Where Emotion <br /> 
            <span className="italic font-light text-stone-500">Meets the Canvas</span>
          </h2>
          <div className="flex justify-center gap-6">
            <Link to="/products" className="px-10 py-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all body-font">
              Explore Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16 border-b border-stone-100 pb-8">
          <h3 className="text-4xl display-font font-bold text-stone-900">Featured Artworks</h3>
          <Link to="/products" className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors body-font">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {featuredArt.map((art) => (
            <Link 
              key={art.id} 
              to={`/product/${art.id}`} 
              state={{ artwork: art }} /* This is the key: Passing the data to the next page */
              className="group flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 mb-6">
                <img 
                  src={art.img || buildArtFallbackDataUri(art.title)} 
                  alt={art.title}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => setFallbackOnImageError(event, art.title)}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>
              <h4 className="display-font font-semibold text-2xl text-stone-800 group-hover:text-stone-500 transition-colors">
                {art.title}
              </h4>
              <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-2 body-font">
                {art.type}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-sm text-stone-900 font-semibold body-font">
                  {art.price}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigate('/cart');
                  }}
                  className="inline-flex items-center gap-2 border border-stone-300 px-3 py-2 text-[10px] uppercase tracking-widest text-stone-700 transition-colors hover:bg-stone-900 hover:text-white body-font"
                >
                  <ShoppingBag size={12} strokeWidth={1.5} />
                  Add to cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
