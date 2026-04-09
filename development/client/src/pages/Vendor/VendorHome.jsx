import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight,
  Clock
} from "lucide-react";

const VendorHome = () => {
  // 1. STATE DEFINITIONS (Must be at the top)
  const [vendorName, setVendorName] = useState("Lead Curator");
  const [loading, setLoading] = useState(true);

  // 2. DATA FETCHING LOGIC
  useEffect(() => {
    const fetchUserData = () => {
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          // Safely check for Username or username
          const name = userObj?.Username || userObj?.username || "Lead Curator";
          setVendorName(name);
        } catch (err) {
          console.error("Failed to parse user data:", err);
          setVendorName("Lead Curator");
        }
      }
    };

    fetchUserData();

    // Elegant loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Mock Data for the Gallery UI
  const stats = [
    { label: "Active Listings", value: "24", icon: Package, trend: "+2 this week" },
    { label: "Orders This Month", value: "12", icon: ShoppingBag, trend: "Stable" },
    { label: "Revenue", value: "रू 48,600", icon: TrendingUp, trend: "+15%" },
  ];

  const orders = [
    { id: "VA-1042", artwork: "Abstract Ethereal", customer: "A. Sharma", status: "Processing", amount: "रू 18,500" },
    { id: "VA-1041", artwork: "Modern Fluidity", customer: "S. Thapa", status: "Shipped", amount: "रू 12,000" },
    { id: "VA-1040", artwork: "Golden Hour Study", customer: "R. Singh", status: "Delivered", amount: "रू 24,000" },
  ];

  // 3. LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center body-font">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Opening Studio...</p>
      </div>
    );
  }

  // 4. MAIN RENDER
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-in fade-in duration-700 body-font">
      <header className="pt-24 pb-12 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-4 block">
          Private Studio Access
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6">
          Welcome back, <span className="italic font-light text-stone-500">{vendorName}</span>
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto"></div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-700">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">{stat.trend}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">{stat.label}</p>
                <p className="text-3xl font-serif text-stone-900 mt-1">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-stone-200 py-8">
          <div>
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-tighter">Studio Actions</h2>
            <p className="text-sm text-stone-500 italic">Curate your collection and manage acquisitions.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="px-6 py-3 border border-stone-300 text-[10px] uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition-all">
              Live Storefront
            </Link>
            <Link to="/vendor/add-artwork" className="px-6 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2">
              <PlusCircle size={12} />
              List New Artwork
            </Link>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-stone-400" />
            <h3 className="text-2xl font-serif text-stone-900">Recent Sales</h3>
          </div>
          <Link to="/orders" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all flex items-center gap-1">
            Full Ledger <ArrowUpRight size={10} />
          </Link>
        </div>

        <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-5 gap-4 px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-100 font-bold">
            <span>Reference</span>
            <span>Artwork Title</span>
            <span>Collector</span>
            <span>Status</span>
            <span className="text-right">Investment</span>
          </div>
          <div className="divide-y divide-stone-50">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 px-8 py-6 text-sm text-stone-700 hover:bg-stone-50/50 transition-colors">
                <span className="font-mono text-xs text-stone-400">{order.id}</span>
                <span className="font-semibold text-stone-900">{order.artwork}</span>
                <span>{order.customer}</span>
                <span className="flex items-center gap-2 text-stone-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Shipped' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
                  {order.status}
                </span>
                <span className="text-right font-medium text-stone-900">{order.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorHome;