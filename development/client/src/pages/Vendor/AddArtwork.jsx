import React, { useState } from 'react';
import { Camera, Plus, ArrowLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddArtwork = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Oil',
    type: '',
    img: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we just simulate a save. Later, this will be your Oracle POST request.
    console.log("Saving to Gallery:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-20 px-6 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-12 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="mb-16">
          <h1 className="text-4xl font-serif text-stone-900 mb-2">Add New <span className="italic font-light text-stone-400">Specimen</span></h1>
          <p className="text-stone-500 text-sm font-serif italic">Expand the digital archive with a new curated piece.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* --- FORM SECTION --- */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Artwork Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Midnight over Pokhara"
                  className="w-full bg-white border border-stone-200 px-4 py-3 outline-none focus:border-stone-900 transition-colors font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Investment (NPR)</label>
                  <input 
                    type="number" 
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25000"
                    className="w-full bg-white border border-stone-200 px-4 py-3 outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white border border-stone-200 px-4 py-3 outline-none focus:border-stone-900 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Oil">Oil</option>
                    <option value="Canvas">Canvas</option>
                    <option value="Digital">Digital</option>
                    <option value="Sculpture">Sculpture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Medium / Type</label>
                <input 
                  type="text" 
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Acrylic on Linen"
                  className="w-full bg-white border border-stone-200 px-4 py-3 outline-none focus:border-stone-900 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                  <input 
                    type="url" 
                    name="img"
                    required
                    value={formData.img}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-stone-200 pl-10 pr-4 py-3 outline-none focus:border-stone-900 transition-colors text-xs"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 flex items-center justify-center gap-3 transition-all duration-500 uppercase tracking-[0.3em] text-[10px] font-bold shadow-xl ${
                submitted ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {submitted ? (
                <> <CheckCircle2 size={16} /> Added to Collection </>
              ) : (
                <> <Plus size={16} /> Catalog Artwork </>
              )}
            </button>
          </form>

          {/* --- PREVIEW SECTION --- */}
          <div className="hidden lg:block">
            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-6 font-bold text-center">Live Preview</label>
            <div className="bg-white p-8 shadow-2xl border border-stone-100 sticky top-24 group">
              <div className="aspect-[4/5] bg-stone-50 overflow-hidden mb-6 relative">
                {formData.img ? (
                  <img src={formData.img} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-4">
                    <Camera size={48} strokeWidth={1} />
                    <p className="text-[9px] uppercase tracking-widest">Image Preview</p>
                  </div>
                )}
              </div>
              <div className="border-t border-stone-50 pt-6">
                <h3 className="font-serif text-2xl text-stone-900 uppercase">
                  {formData.title || "Untitled Work"}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                    {formData.type || "Medium not specified"}
                  </p>
                  <p className="text-lg text-stone-900 font-light">
                    रू {formData.price ? Number(formData.price).toLocaleString() : "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddArtwork;