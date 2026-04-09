import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { buildArtFallbackDataUri, setFallbackOnImageError } from '../utils/imageFallback.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const SingleProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const art = location.state?.art;
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authenticating... Please log in to complete your acquisition.");
      navigate('/login');
      return;
    }

    // CHECK: If art._id is a simple number (like 1, 2, 3), the backend WILL fail.
    // This button only works for items saved in your MongoDB database.
    if (!art._id || art._id.length < 10) {
      alert("This is a demo item. Please purchase an item from the live catalog.");
      return;
    }

    setBuying(true);
    try {
      const response = await fetch(`${API_BASE}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              // FIX: Map the ID to 'product' to satisfy the Backend Schema
              product: art._id, 
              productName: art.title || art.productName,
              productPrice: art.price || art.productPrice,
              quantity: 1,
            },
          ],
          totalAmount: art.price || art.productPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Validation Error:", errorData);
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.message || 'Payment initiation failed. Please try again.');
      }
    } catch (err) {
      console.error('Buy now error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setBuying(false);
    }
  };

  if (!art) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAF9F6] font-serif italic text-stone-500">
        <p className="mb-4">Artwork details are currently unavailable.</p>
        <Link to="/products" className="text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 text-stone-900">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 animate-in fade-in duration-1000">
      <nav className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>
      </nav>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-7">
          <div className="aspect-[4/5] bg-white p-6 shadow-2xl border border-stone-100 group overflow-hidden">
            <img
              src={art.img || art.productImage || buildArtFallbackDataUri(art.title)}
              alt={art.title}
              onError={(event) => setFallbackOnImageError(event, art.title)}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
            />
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-12">
          <div className="border-b border-stone-200 pb-8 mb-8">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">
                {/* Clean up ID display for scholars */}
                Private Collection No. {art._id ? art._id.slice(-6).toUpperCase() : `00${art.id}`}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 uppercase tracking-tighter font-bold">
                Available
              </span>
            </div>

            <h1 className="text-5xl font-serif text-stone-900 mb-4 leading-tight">
              {art.title || art.productName}
            </h1>
            <p className="text-xl font-serif italic text-stone-500 mb-6">
              {art.type || art.productCategory}
            </p>
            <p className="text-4xl text-stone-900 font-light tracking-tight">
              रू {(art.price || art.productPrice).toLocaleString()}
            </p>
          </div>

          <div className="mb-12">
            <h4 className="text-[10px] uppercase tracking-widest text-stone-900 mb-4 font-bold">
              Curatorial Note
            </h4>
            <p className="text-stone-600 leading-relaxed font-serif text-lg italic mb-6">
              "This piece was selected for the 2026 collection based on its unique emotional resonance and mastery of {(art.type || 'this medium').toLowerCase()}."
            </p>

            <div className="grid grid-cols-1 gap-4 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-3 text-stone-500">
                <ShieldCheck size={16} strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-widest">Certificate of Authenticity Included</span>
              </div>
              <div className="flex items-center gap-3 text-stone-500">
                <Truck size={16} strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-widest">Insured Shipping from Pokhara</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => addToCart(art)}
            className="w-full py-6 bg-stone-900 text-white text-[10px] uppercase tracking-[0.3em] hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-xl group active:scale-95 mb-4"
          >
            <ShoppingBag size={14} className="group-hover:scale-110 transition-transform" />
            Acquire for Collection
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buying}
            className="w-full mt-3 py-6 bg-[#5C2D91] text-white text-[10px] uppercase tracking-[0.3em] hover:bg-[#4a2475] transition-all flex items-center justify-center gap-3 shadow-xl group active:scale-95 disabled:opacity-50"
          >
            <CreditCard size={14} className="group-hover:scale-110 transition-transform" />
            {buying ? 'Securing Transaction...' : 'Direct Purchase (Khalti)'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SingleProduct;