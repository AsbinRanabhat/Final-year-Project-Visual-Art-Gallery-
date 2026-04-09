import React, { useState } from 'react';
import { Settings, Heart, Box, Clock, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Mock user data
  const collector = {
    name: "Asbim Ranabhat",
    memberSince: "March 2026",
    level: "Platinum Collector",
    email: "asbin@example.com",
    location: "Pokhara, Nepal"
  };

  const collections = [
    { id: 1, title: "Abstract Ethereal", date: "Jan 12, 2026", status: "Delivered", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400" },
    { id: 2, title: "Modern Fluidity", date: "Feb 05, 2026", status: "In Transit", img: "https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=400" },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });
    } catch {
      // Even if the request fails, we still clear local auth state.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* --- PROFILE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-200 pb-12 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-stone-200 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-sm">
               <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" 
                alt="Collector" 
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">{collector.level}</span>
              <h1 className="text-4xl font-serif text-stone-900 mt-1">{collector.name}</h1>
              <p className="text-sm text-stone-500 mt-2">{collector.location} • Member since {collector.memberSince}</p>
            </div>
          </div>
          <button className="mt-8 md:mt-0 flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-600 border border-stone-200 px-6 py-3 hover:bg-white transition-all">
            <Settings size={14} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* --- SIDE NAVIGATION --- */}
          <aside className="lg:col-span-1 space-y-1">
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest transition-all">
              <Box size={16} /> My Collection
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-stone-500 hover:bg-white hover:text-stone-900 text-[10px] uppercase tracking-widest transition-all">
              <Heart size={16} /> Wishlist
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-stone-500 hover:bg-white hover:text-stone-900 text-[10px] uppercase tracking-widest transition-all">
              <Clock size={16} /> Purchase History
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-stone-500 hover:bg-white hover:text-stone-900 text-[10px] uppercase tracking-widest transition-all">
              <ShieldCheck size={16} /> Authentication
            </button>
            <div className="pt-8">
              <button
                className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-600 text-[10px] uppercase tracking-widest transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut size={16} /> {loggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-stone-800">Recent Acquisitions</h2>
              <span className="text-[10px] uppercase tracking-widest text-stone-400">{collections.length} Items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((item) => (
                <div key={item.id} className="bg-white border border-stone-100 p-4 flex gap-6 group hover:shadow-md transition-shadow">
                  <div className="w-24 h-32 overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <h4 className="font-serif text-lg text-stone-800">{item.title}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-400' : 'bg-amber-400'}`}></div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-600">{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty Wishlist Prompt */}
            <div className="mt-12 bg-white border border-dashed border-stone-200 p-12 text-center">
              <Heart size={32} className="mx-auto text-stone-200 mb-4" />
              <p className="font-serif italic text-stone-500 text-lg">Your wishlist is waiting to be filled.</p>
              <button className="mt-6 text-[10px] uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-all">
                Explore the Gallery
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;
