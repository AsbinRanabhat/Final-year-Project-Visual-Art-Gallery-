import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="group">
              <h2 className="text-xl font-serif tracking-[0.2em] text-stone-900">
                VISUAL <br />
                <span className="font-light italic text-stone-500">Art Gallery</span>
              </h2>
            </Link>
            <p className="mt-6 text-stone-400 text-sm leading-relaxed max-w-xs">
              A curated collection of modern masterpieces, bringing the world's most evocative art into your private space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">GALLERY</Link></li>
              <li><Link to="/about" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">OUR STORY</Link></li>
              <li><Link to="/contact" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">EXHIBITIONS</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-6">Assistance</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">SHIPPING & RETURNS</Link></li>
              <li><Link to="/contact" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">ART ADVISORY</Link></li>
              <li><Link to="/contact" className="text-stone-400 hover:text-stone-900 text-xs tracking-widest transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-6">Newsletter</h4>
            <p className="text-stone-400 text-xs tracking-wide mb-4">Join our inner circle for private viewings.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-stone-200 py-2 text-[10px] tracking-widest focus:outline-none focus:border-stone-900 transition-colors uppercase"
              />
              <button type="submit" className="absolute right-0 bottom-2 text-stone-400 hover:text-stone-900 transition-colors">
                <Mail size={16} strokeWidth={1} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-stone-50">
          <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase mb-6 md:mb-0">
            © 2026 VISUAL ART GALLERY. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex space-x-8 text-stone-400">
            <a href="#" className="hover:text-stone-900 transition-colors"><Instagram size={18} strokeWidth={1.2} /></a>
            <a href="#" className="hover:text-stone-900 transition-colors"><Twitter size={18} strokeWidth={1.2} /></a>
            <a href="#" className="hover:text-stone-900 transition-colors"><Facebook size={18} strokeWidth={1.2} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;