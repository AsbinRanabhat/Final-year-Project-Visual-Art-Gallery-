import React from 'react';
import { ArrowRight, Award, Globe, Heart } from 'lucide-react';

// Importing your photo from the same images folder
import curatorPhoto from '../images/me.png'; 

const AboutUs = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen animate-in fade-in duration-1000">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-6 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight mb-8">
              Curating <br />
              <span className="italic font-light text-stone-500">Timeless Visions</span>
            </h1>
            <p className="text-stone-600 leading-relaxed max-w-md mb-8">
              Founded in 2026, VISUAL Art Gallery began with a simple mission: to bridge the gap between 
              emerging contemporary artists and discerning collectors who seek more than just decoration.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden bg-stone-200 shadow-2xl">
              <img 
                /* Updated to the requested Cloud Painting */
                src="https://images.unsplash.com/photo-1565876427310-0695a4ff03b7?q=80&w=793&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="White Clouds Painting" 
                className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 bg-white p-8 hidden md:block border border-stone-100 shadow-sm">
              <p className="font-serif italic text-2xl text-stone-800">"Art is the only way to run away without leaving home."</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-4">— Twyla Tharp</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="bg-stone-900 text-stone-100 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Heart className="text-stone-500" size={30} strokeWidth={1} />
            <h3 className="text-xl font-serif">Deep Passion</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              We select every piece with an emotional connection in mind, ensuring our collection resonates on a personal level.
            </p>
          </div>
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Award className="text-stone-500" size={30} strokeWidth={1} />
            <h3 className="text-xl font-serif">Uncompromising Quality</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              From the choice of canvas to the final varnish, we represent artists who prioritize technical excellence.
            </p>
          </div>
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Globe className="text-stone-500" size={30} strokeWidth={1} />
            <h3 className="text-xl font-serif">Global Reach</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Connecting local talent with international collectors, fostering a global community of art enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* --- THE CURATOR SECTION --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 grayscale hover:grayscale-0 transition-all duration-700 shadow-inner">
            <img 
              src={curatorPhoto} 
              alt="Asbim Ranabhat" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-serif text-stone-900">Asbim Ranabhat</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-2">Lead Curator & Founder</p>
        </div>
        <p className="text-xl font-serif italic text-stone-600 leading-relaxed mb-10 max-w-3xl mx-auto">
          "We believe that art shouldn't just exist in a room; it should transform the room. 
          Our gallery is a sanctuary for those who value the silent dialogue between the viewer and the canvas."
        </p>
        <button className="inline-flex items-center gap-4 text-[10px] uppercase tracking-widest text-stone-900 font-semibold group border-b border-stone-200 pb-2 hover:border-stone-900 transition-all">
          Contact the curator <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

    </div>
  );
};

export default AboutUs;