import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search,
  Home as HomeIcon,
  Palette,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

// Import the Cart Hook
import { useCart } from '../context/CartContext.jsx'; 

// Importing your logo
import logo from '../images/logo.png'; 

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // FIX: Destructure 'cartItems' (which matches your CartContext.jsx)
  const { cartItems } = useCart(); 

  // Get Auth State from LocalStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Gallery', path: '/products', icon: Palette },
  ];

  if (userRole === 'vendor' || userRole === 'admin') {
    navLinks.push({ name: 'Dashboard', path: '/vendor', icon: LayoutDashboard });
  }

  // Calculate total items (sum of quantities)
  const totalItems = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Visual Art Gallery" 
                className="h-16 w-auto min-w-[120px] object-contain transition-transform duration-300 hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors duration-300 font-bold"
              >
                <link.icon size={16} strokeWidth={1.5} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons & Auth Section */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-stone-600 hover:text-stone-900 transition-transform hover:scale-110">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link to="/profile" className="text-stone-600 hover:text-stone-900 transition-transform hover:scale-110">
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* SHOPPING BAG WITH CORRECT DYNAMIC COUNT */}
            <Link to="/cart" className="relative text-stone-600 hover:text-stone-900 transition-transform hover:scale-110">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {token ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 ml-4 px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="ml-4 px-6 py-2 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-100">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-3 text-lg text-stone-800 font-bold"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={18} strokeWidth={1.5} />
                {link.name}
              </Link>
            ))}
            
            <div className="flex flex-col gap-4 pt-4 border-t border-stone-100">
              <div className="flex space-x-6 items-center">
                <Link to="/profile" onClick={() => setIsOpen(false)}><User size={22} /></Link>
                <Link to="/cart" className="relative" onClick={() => setIsOpen(false)}>
                  <ShoppingBag size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
              
              {token ? (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left flex items-center gap-2 text-red-600 font-bold"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="font-bold text-stone-900">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;