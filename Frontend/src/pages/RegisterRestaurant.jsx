import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Trash2,
  X
} from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Restaurant Info', icon: Store },
  { num: 2, label: 'Gallery & Description', icon: Upload },
  { num: 3, label: 'Menu Setup', icon: UtensilsCrossed },
  { num: 4, label: 'Hours & Confirm', icon: Clock },
];

const CUISINE_OPTIONS = [
  'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian',
  'American', 'French', 'Thai', 'Korean', 'Mediterranean',
  'Vietnamese', 'Middle Eastern', 'African', 'Fusion', 'Fast Food',
  'Healthy', 'Seafood', 'BBQ', 'Desserts', 'Bakery'
];

const HOURS_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function RegisterRestaurant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Step 1 - Restaurant Info
  const [form, setForm] = useState({
    name: '',
    cuisine: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    restaurantType: 'Restaurant',
  });

  // Step 2 - Gallery & Description
  const [description, setDescription] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Step 3 - Menu
  const [menuCategories, setMenuCategories] = useState([
    { id: 1, name: 'Main Course', items: [{ id: Date.now(), name: '', price: '', desc: '' }] }
  ]);

  // Step 4 - Hours
  const [operatingHours, setOperatingHours] = useState(
    DAYS.map(d => ({ day: d, open: '09:00 AM', close: '10:00 PM', closed: false }))
  );
  const [deliveryFee, setDeliveryFee] = useState('2.99');
  const [deliveryTime, setDeliveryTime] = useState('30-40');

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addCategory = () => {
    setMenuCategories(prev => [
      ...prev,
      { id: Date.now(), name: '', items: [{ id: Date.now(), name: '', price: '', desc: '' }] }
    ]);
  };

  const updateCategoryName = (catId, name) => {
    setMenuCategories(prev => prev.map(c => c.id === catId ? { ...c, name } : c));
  };

  const removeCategory = (catId) => {
    if (menuCategories.length <= 1) return;
    setMenuCategories(prev => prev.filter(c => c.id !== catId));
  };

  const addItem = (catId) => {
    setMenuCategories(prev => prev.map(c =>
      c.id === catId ? { ...c, items: [...c.items, { id: Date.now(), name: '', price: '', desc: '' }] } : c
    ));
  };

  const updateItem = (catId, itemId, field, value) => {
    setMenuCategories(prev => prev.map(c =>
      c.id === catId ? {
        ...c,
        items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
      } : c
    ));
  };

  const removeItem = (catId, itemId) => {
    setMenuCategories(prev => prev.map(c =>
      c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
    ));
  };

  const updateHour = (dayIdx, field, value) => {
    setOperatingHours(prev => prev.map((h, i) => i === dayIdx ? { ...h, [field]: value } : h));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleComplete = () => {
    setCompleted(true);
    // Simulate saving restaurant data to localStorage
    const restaurantData = {
      ...form,
      description,
      operatingHours,
      deliveryFee,
      deliveryTime,
      menuCategories,
      _id: `rest_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('df_my_restaurant', JSON.stringify(restaurantData));
    setTimeout(() => navigate('/owner'), 1200);
  };

  const isStepValid = () => {
    if (step === 1) return form.name && form.cuisine && form.phone && form.address;
    if (step === 2) return description.length >= 10;
    if (step === 3) {
      return menuCategories.some(c => c.name && c.items.some(i => i.name && i.price));
    }
    return true;
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const [[page, dir], setPage] = useState([0, 0]);
  const paginate = (newStep) => {
    setDir(newStep > step ? 1 : -1);
    setStep(newStep);
    setPage([newStep, newStep > step ? 1 : -1]);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#070B14', color: '#fff' }}>
      {/* ─── LEFT SIDEBAR STEPS ─── */}
      <div className="w-[300px] flex-shrink-0 p-8 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-[#F5B301] flex items-center justify-center text-black font-black text-sm">DF</div>
          <span className="font-black text-lg tracking-tight">Delicious Food</span>
        </div>

        <div className="flex flex-col gap-0">
          {STEPS.map((s, idx) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            const Icon = s.icon;
            return (
              <button
                key={s.num}
                onClick={() => isDone && paginate(s.num)}
                disabled={!isDone && !isActive}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left border-none cursor-pointer w-full ${
                  isActive ? '' : isDone ? 'opacity-70 hover:opacity-100' : 'opacity-30'
                }`}
                style={{
                  background: isActive ? 'rgba(245,179,1,0.08)' : 'transparent',
                }}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-[#F5B301] text-black'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  {isDone ? <CheckCircle2 size={18} /> : s.num}
                </div>
                <div>
                  <div className="text-xs font-bold opacity-50 uppercase tracking-wider">Step {s.num}</div>
                  <div className={`font-bold text-sm ${isActive ? 'text-[#F5B301]' : ''}`}>{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 px-4">
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5B301] transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <p className="text-[10px] font-bold opacity-40 mt-2 text-center uppercase tracking-wider">
            Step {step} of 4
          </p>
        </div>
      </div>

      {/* ─── MAIN FORM CONTENT ─── */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black mb-3">Registration Complete! 🎉</h2>
            <p className="text-white/50 text-sm max-w-md mb-2">
              Your restaurant profile has been created. We're redirecting you to your Owner Dashboard.
            </p>
            <p className="text-[10px] text-white/30 font-bold">Please wait while we set up your dashboard...</p>
            <div className="mt-8 w-8 h-8 border-4 border-[#F5B301] border-t-transparent animate-spin rounded-full" />
          </motion.div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-black">{STEPS[step - 1].label}</h1>
              <div className="px-3 py-1 rounded-full bg-[#F5B301]/10 text-[#F5B301] text-[10px] font-black uppercase tracking-wider">
                Step {step} of 4
              </div>
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="max-w-3xl"
              >
                {/* STEP 1: Restaurant Info */}
                {step === 1 && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Restaurant Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => updateForm('name', e.target.value)}
                          placeholder="e.g. The Green Bowl"
                          className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Cuisine Type *</label>
                        <select
                          value={form.cuisine}
                          onChange={(e) => updateForm('cuisine', e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        >
                          <option value="" style={{ background: '#070B14' }}>Select cuisine...</option>
                          {CUISINE_OPTIONS.map(c => (
                            <option key={c} value={c} style={{ background: '#070B14' }}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Restaurant Type *</label>
                        <select
                          value={form.restaurantType}
                          onChange={(e) => updateForm('restaurantType', e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        >
                          <option style={{ background: '#070B14' }}>Restaurant</option>
                          <option style={{ background: '#070B14' }}>Fast Food</option>
                          <option style={{ background: '#070B14' }}>Cafe</option>
                          <option style={{ background: '#070B14' }}>Food Truck</option>
                          <option style={{ background: '#070B14' }}>Bakery</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Phone *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            placeholder="+1 234 567 890"
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            placeholder="contact@restaurant.com"
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Address *</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-4 text-white/30" />
                          <textarea
                            value={form.address}
                            onChange={(e) => updateForm('address', e.target.value)}
                            placeholder="Full restaurant address"
                            rows={2}
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all resize-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Website</label>
                        <div className="relative">
                          <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="url"
                            value={form.website}
                            onChange={(e) => updateForm('website', e.target.value)}
                            placeholder="https://restaurant.com"
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Gallery & Description */}
                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Restaurant Description *</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell customers about your restaurant — your story, specialties, atmosphere..."
                        rows={4}
                        className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold transition-all resize-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                      />
                      <p className="text-[10px] text-white/30 font-bold mt-1">{description.length} characters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cover Image */}
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Cover Image</label>
                        <label
                          className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-[#F5B301]/50"
                          style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
                        >
                          {coverPreview ? (
                            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload size={24} className="text-white/30" />
                              <span className="text-xs text-white/40 font-bold">Upload Cover Photo</span>
                              <span className="text-[9px] text-white/20">Recommended: 1200×600px</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                      </div>

                      {/* Logo */}
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Restaurant Logo</label>
                        <label
                          className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-[#F5B301]/50"
                          style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
                        >
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Store size={24} className="text-white/30" />
                              <span className="text-xs text-white/40 font-bold">Upload Logo</span>
                              <span className="text-[9px] text-white/20">PNG, JPG, SVG</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Menu Setup */}
                {step === 3 && (
                  <div className="flex flex-col gap-8">
                    <p className="text-sm text-white/50 font-bold">Add menu categories and items for your restaurant. You can always edit these later.</p>

                    {menuCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-6 rounded-3xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                            placeholder="Category name (e.g. Main Course, Appetizers)"
                            className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm font-bold mr-3"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          />
                          {menuCategories.length > 1 && (
                            <button onClick={() => removeCategory(cat.id)}
                              className="p-2 rounded-xl cursor-pointer border-none text-red-400 hover:bg-red-500/10 transition-all"
                              style={{ background: 'rgba(255,255,255,0.04)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          {cat.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(cat.id, item.id, 'name', e.target.value)}
                                placeholder="Item name"
                                className="flex-[3] px-4 py-2.5 rounded-xl outline-none text-xs font-bold"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                              />
                              <input
                                type="text"
                                value={item.desc}
                                onChange={(e) => updateItem(cat.id, item.id, 'desc', e.target.value)}
                                placeholder="Brief description"
                                className="flex-[3] px-4 py-2.5 rounded-xl outline-none text-xs font-bold"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                              />
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateItem(cat.id, item.id, 'price', e.target.value)}
                                placeholder="Price"
                                className="flex-[1] px-4 py-2.5 rounded-xl outline-none text-xs font-bold"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                              />
                              {cat.items.length > 1 && (
                                <button onClick={() => removeItem(cat.id, item.id)}
                                  className="p-2 rounded-xl cursor-pointer border-none text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => addItem(cat.id)}
                          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#F5B301] bg-transparent border-none cursor-pointer hover:opacity-70 transition-all"
                        >
                          <Plus size={14} /> Add Item
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={addCategory}
                      className="self-start flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer transition-all border-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>
                )}

                {/* STEP 4: Operating Hours & Confirm */}
                {step === 4 && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h3 className="text-lg font-black mb-4">Operating Hours</h3>
                      <div className="flex flex-col gap-2 p-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {operatingHours.map((h, idx) => (
                          <div key={h.day} className="flex items-center gap-4 py-2">
                            <span className="w-24 text-sm font-bold">{h.day}</span>
                            <label className="flex items-center gap-2 text-xs font-bold text-white/50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={h.closed}
                                onChange={(e) => updateHour(idx, 'closed', e.target.checked)}
                                className="rounded border-white/20"
                              />
                              Closed
                            </label>
                            {!h.closed && (
                              <div className="flex items-center gap-2">
                                <select
                                  value={h.open}
                                  onChange={(e) => updateHour(idx, 'open', e.target.value)}
                                  className="px-3 py-2 rounded-xl outline-none text-xs font-bold"
                                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                                >
                                  {HOURS_OPTIONS.map(t => <option key={t} value={t} style={{ background: '#070B14' }}>{t}</option>)}
                                </select>
                                <span className="text-white/30">to</span>
                                <select
                                  value={h.close}
                                  onChange={(e) => updateHour(idx, 'close', e.target.value)}
                                  className="px-3 py-2 rounded-xl outline-none text-xs font-bold"
                                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                                >
                                  {HOURS_OPTIONS.map(t => <option key={t} value={t} style={{ background: '#070B14' }}>{t}</option>)}
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Delivery Fee ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Delivery Time (min)</label>
                        <input
                          type="text"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          placeholder="e.g. 30-40"
                          className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm font-bold"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="p-6 rounded-3xl" style={{ background: 'rgba(245,179,1,0.05)', border: '1px solid rgba(245,179,1,0.15)' }}>
                      <h3 className="text-sm font-black text-[#F5B301] mb-3">📋 Registration Summary</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-white/40">Restaurant:</span> <span className="font-bold">{form.name || '—'}</span></div>
                        <div><span className="text-white/40">Cuisine:</span> <span className="font-bold">{form.cuisine || '—'}</span></div>
                        <div><span className="text-white/40">Categories:</span> <span className="font-bold">{menuCategories.length}</span></div>
                        <div><span className="text-white/40">Menu Items:</span> <span className="font-bold">{menuCategories.reduce((a, c) => a + c.items.filter(i => i.name).length, 0)}</span></div>
                        <div><span className="text-white/40">Delivery Fee:</span> <span className="font-bold">${deliveryFee}</span></div>
                        <div><span className="text-white/40">Delivery Time:</span> <span className="font-bold">{deliveryTime} min</span></div>
                      </div>
                    </div>

                    <button
                      onClick={handleComplete}
                      className="w-full py-4 bg-[#F5B301] text-black font-black rounded-full text-lg hover:bg-[#d99a00] transition-all cursor-pointer border-none shadow-lg"
                    >
                      Complete Registration 🚀
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ─── NAVIGATION BUTTONS ─── */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button
                  onClick={step > 1 ? () => paginate(step - 1) : undefined}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer transition-all border-none ${
                    step === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  onClick={() => paginate(step + 1)}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black cursor-pointer transition-all border-none ${
                    isStepValid() ? 'bg-[#F5B301] text-black hover:bg-[#d99a00]' : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
