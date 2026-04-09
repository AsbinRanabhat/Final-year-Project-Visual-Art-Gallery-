import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen animate-in fade-in duration-1000">
      
      {/* --- HEADER SECTION --- */}
      <section className="pt-20 pb-12 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-4 block">
          Get in Touch
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6">
          Start a <span className="italic font-light text-stone-500">Conversation</span>
        </h1>
        <p className="max-w-xl mx-auto text-stone-600 text-sm leading-relaxed">
          Whether you are an aspiring collector or an artist looking for representation, 
          we would love to hear from you at our Pokhara gallery.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* --- CONTACT INFORMATION --- */}
          <div className="space-y-12 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">The Gallery</h3>
                <p className="text-stone-800 text-sm flex items-start gap-3">
                  <MapPin size={16} className="text-stone-400 shrink-0" />
                  Street No. 4, Lakeside,<br />Pokhara, Nepal
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Inquiries</h3>
                <p className="text-stone-800 text-sm flex items-center gap-3">
                  <Mail size={16} className="text-stone-400" />
                  hello@visualart.gallery
                </p>
                <p className="text-stone-800 text-sm flex items-center gap-3">
                  <Phone size={16} className="text-stone-400" />
                  +977 9863184559
                </p>
              </div>
            </div>

            {/* Visual Element / Google Map of Pokhara - Always Colorful */}
            <div className="aspect-video bg-stone-200 overflow-hidden border border-stone-100 shadow-sm">
              <iframe 
                title="Map of Pokhara"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56215.16335967205!2d83.94056157018318!3d28.209483017124395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995937bbf0376ff%3A0xf6cf823b25802164!2sPokhara!5e0!3m2!1sen!2snp!4v1710320000000!5m2!1sen!2snp" 
                className="w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* --- INQUIRY FORM --- */}
          <div className="bg-white p-8 md:p-12 border border-stone-100 shadow-sm order-1 lg:order-2">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-500">First Name</label>
                  <input type="text" className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none transition-colors bg-transparent" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-500">Last Name</label>
                  <input type="text" className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none transition-colors bg-transparent" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-500">Email Address</label>
                <input type="email" className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none transition-colors bg-transparent" placeholder="jane@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-500">Subject</label>
                <select className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none transition-colors bg-transparent">
                  <option>General Inquiry</option>
                  <option>Artwork Acquisition</option>
                  <option>Artist Submission</option>
                  <option>Private Viewing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-500">Your Message</label>
                <textarea rows="4" className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none transition-colors bg-transparent resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button className="w-full bg-stone-900 text-white text-[10px] uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-3 hover:bg-stone-800 transition-all group">
                Send Message <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactUs;