import React, { useState } from 'react';

const AddArtwork = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    type: '',
    img: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Archive Submission:", formData);
    alert("Artwork specimen recorded in archive.");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 px-10 body-font">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif italic mb-10 text-stone-900 text-center">Catalog New Specimen</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 border border-stone-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-400">Title of Work</label>
            <input 
              type="text" 
              className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900 transition-colors font-serif text-lg bg-transparent"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400">Investment (रू)</label>
              <input 
                type="number" 
                className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900 transition-colors bg-transparent"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400">Medium</label>
              <input 
                type="text" 
                className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900 transition-colors bg-transparent"
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-400">Visual URL (Source Path)</label>
            <input 
              type="text" 
              className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900 transition-colors bg-transparent"
              onChange={(e) => setFormData({...formData, img: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-stone-900 text-white py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 transition-all mt-4 shadow-md"
          >
            Commit to Archive
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArtwork;