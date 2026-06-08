import { useState } from 'react';
import {
  UtensilsCrossed, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Search, ChevronDown, Bell, Image as ImageIcon, X,
  Pizza, Coffee, Salad, Beef,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';

// ─── Mock Data ───────────────────────────────────────────────────
const INIT_CATEGORIES = [
  { _id: 'cat_1', name: 'Pizza',      icon: '🍕', itemCount: 8 },
  { _id: 'cat_2', name: 'Burgers',    icon: '🍔', itemCount: 5 },
  { _id: 'cat_3', name: 'Salads',     icon: '🥗', itemCount: 6 },
  { _id: 'cat_4', name: 'Drinks',     icon: '🥤', itemCount: 7 },
  { _id: 'cat_5', name: 'Desserts',   icon: '🍰', itemCount: 4 },
];

const INIT_ITEMS = [
  { _id: 'i1', name: 'Margherita Pizza',   category: 'cat_1', price: 12.99, description: 'Classic delight with 100% real mozzarella and fresh basil.', isAvailable: true,  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80' },
  { _id: 'i2', name: 'Pepperoni Pizza',    category: 'cat_1', price: 14.99, description: 'Loaded with premium pepperoni and mozzarella.',             isAvailable: true,  image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80' },
  { _id: 'i3', name: 'BBQ Chicken Pizza',  category: 'cat_1', price: 15.99, description: 'Smoky BBQ sauce, grilled chicken, red onion.',              isAvailable: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
  { _id: 'i4', name: 'Beef Burger',        category: 'cat_2', price: 11.49, description: 'Double beef patty, cheddar, lettuce, house sauce.',         isAvailable: true,  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
  { _id: 'i5', name: 'Grilled Chicken',    category: 'cat_2', price: 11.49, description: 'Tender chicken breast, avocado, Swiss cheese, aioli.',      isAvailable: true,  image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=200&q=80' },
  { _id: 'i6', name: 'Quinoa Veggie Bowl', category: 'cat_3', price: 11.49, description: 'Organic quinoa, roasted sweet potatoes, sesame dressing.',   isAvailable: true,  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80' },
  { _id: 'i7', name: 'Pasta Primavera',    category: 'cat_3', price: 11.49, description: 'Penne with broccoli, cherry tomatoes, parmesan.',            isAvailable: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
  { _id: 'i8', name: 'Chocolate Shake',    category: 'cat_4', price: 14.99, description: 'Thick dark chocolate shake with chocolate drizzle.',         isAvailable: true,  image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80' },
  { _id: 'i9', name: 'Avocado Toast',      category: 'cat_3', price: 9.99,  description: 'Smashed avocado, poached egg, pumpkin seeds on sourdough.', isAvailable: true,  image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=200&q=80' },
];

const EMPTY_ITEM = { name: '', category: '', price: '', description: '', isAvailable: true, image: '' };

export default function OwnerMenuPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [items,      setItems]      = useState(INIT_ITEMS);
  const [activeTab,  setActiveTab]  = useState('cat_1');
  const [search,     setSearch]     = useState('');

  // Modal state
  const [itemModal,  setItemModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_ITEM);

  const restaurant = { name: 'The Green Bowl', cuisine: 'Italian Cuisine', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' };

  const inputBg     = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)'  : '#e5e5e5';
  const inputColor  = dark ? '#fff' : '#1a1a1a';

  const filtered = items.filter((item) => {
    const matchCat    = activeTab === 'all' || item.category === activeTab;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_ITEM, category: activeTab });
    setItemModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setItemModal(true);
  };

  const saveItem = () => {
    if (!form.name || !form.price) return;
    if (editItem) {
      setItems((prev) => prev.map((i) => (i._id === editItem._id ? { ...i, ...form } : i)));
    } else {
      setItems((prev) => [...prev, { ...form, _id: `i_${Date.now()}`, price: parseFloat(form.price) }]);
      setCategories((prev) => prev.map((c) => c._id === form.category ? { ...c, itemCount: c.itemCount + 1 } : c));
    }
    setItemModal(false);
  };

  const deleteItem = (id) => {
    const item = items.find((i) => i._id === id);
    setItems((prev) => prev.filter((i) => i._id !== id));
    if (item) setCategories((prev) => prev.map((c) => c._id === item.category ? { ...c, itemCount: Math.max(0, c.itemCount - 1) } : c));
  };

  const toggleAvailable = (id) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, isAvailable: !i.isAvailable } : i)));
  };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Menu Management</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Create and manage your restaurant menu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer" style={{ background: cardBg, borderColor: borderCol }}>
            <img src={restaurant.logo} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold" style={{ color: textTitle }}>{restaurant.name}</p>
              <p className="text-xs" style={{ color: textSub }}>{restaurant.cuisine}</p>
            </div>
            <ChevronDown size={16} style={{ color: textSub }} />
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: cardBg, borderColor: borderCol }}>
              <Bell size={18} style={{ color: textSub }} />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">5</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">

        {/* ── Left: Categories ──────────────────────────────── */}
        <div className="w-56 flex-shrink-0">
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: borderCol }}>
              <span className="text-sm font-bold" style={{ color: textTitle }}>Categories</span>
            </div>

            {/* All option */}
            <button
              onClick={() => setActiveTab('all')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left transition-all border-b"
              style={{
                borderColor: borderCol,
                background: activeTab === 'all' ? 'rgba(245,179,1,0.08)' : 'transparent',
                color: activeTab === 'all' ? '#F5B301' : textSub,
              }}
            >
              <span>🍽️</span>
              <span className="flex-1">All Items</span>
              <span className="text-xs">{items.length}</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveTab(cat._id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left transition-all border-b"
                style={{
                  borderColor: borderCol,
                  background: activeTab === cat._id ? 'rgba(245,179,1,0.08)' : 'transparent',
                  color: activeTab === cat._id ? '#F5B301' : textTitle,
                }}
              >
                <span>{cat.icon}</span>
                <span className="flex-1">{cat.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: activeTab === cat._id ? 'rgba(245,179,1,0.15)' : (dark ? 'rgba(255,255,255,0.07)' : '#f0f0f0'), color: activeTab === cat._id ? '#F5B301' : textSub }}>
                  {cat.itemCount}
                </span>
              </button>
            ))}

            {/* Add Category */}
            <button className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors"
              style={{ color: '#F5B301' }}>
              <Plus size={14} /> Add Category
            </button>
          </div>
        </div>

        {/* ── Right: Items ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
              <input type="text" placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
                style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ml-auto"
              style={{ background: '#F5B301', color: '#000' }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          {/* Grid of items */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ background: cardBg, borderColor: borderCol }}>
              <UtensilsCrossed size={40} style={{ color: textSub }} className="mb-3 opacity-40" />
              <p className="font-bold" style={{ color: textTitle }}>No items found</p>
              <p className="text-sm mt-1 mb-4" style={{ color: textSub }}>Add your first menu item to this category</p>
              <button onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: '#F5B301', color: '#000' }}>
                <Plus size={14} className="inline mr-1.5" /> Add Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item._id} className="rounded-2xl border overflow-hidden group"
                  style={{ background: cardBg, borderColor: borderCol }}>
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
                          <ImageIcon size={28} style={{ color: textSub }} className="opacity-30" />
                        </div>
                    }
                    {/* Availability badge */}
                    <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: item.isAvailable ? 'rgba(34,197,94,0.9)' : 'rgba(248,113,113,0.9)', color: '#fff' }}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-sm leading-tight" style={{ color: textTitle }}>{item.name}</h3>
                      <span className="font-black text-sm flex-shrink-0" style={{ color: '#F5B301' }}>${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: textSub }}>{item.description}</p>

                    {/* Action row */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleAvailable(item._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex-1"
                        style={{ background: item.isAvailable ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', color: item.isAvailable ? '#22c55e' : '#f87171' }}>
                        {item.isAvailable ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {item.isAvailable ? 'On' : 'Off'}
                      </button>
                      <button onClick={() => openEdit(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border hover:opacity-70"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                        <Pencil size={13} style={{ color: textSub }} />
                      </button>
                      <button onClick={() => deleteItem(item._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border hover:opacity-70"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                        <Trash2 size={13} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Item Modal ────────────────────────────── */}
      {itemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setItemModal(false)}>
          <div className="rounded-2xl border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{ background: cardBg, borderColor: borderCol }}
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setItemModal(false)} style={{ color: textSub }}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Item Name', key: 'name', type: 'text', placeholder: 'e.g. Pepperoni Pizza' },
                { label: 'Price ($)', key: 'price', type: 'number', placeholder: '0.00' },
                { label: 'Image URL', key: 'image', type: 'text', placeholder: 'https://...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: textSub }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl text-sm outline-none px-4 py-2.5"
                    style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: textSub }}>Category</label>
                <div className="relative">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl text-sm outline-none px-4 py-2.5 pr-8 appearance-none"
                    style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSub }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: textSub }}>Description</label>
                <textarea rows={3} placeholder="Describe the item..." value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl text-sm outline-none px-4 py-2.5 resize-none"
                  style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))}>
                  {form.isAvailable ? <ToggleRight size={24} style={{ color: '#22c55e' }} /> : <ToggleLeft size={24} style={{ color: '#94a3b8' }} />}
                </button>
                <span className="text-sm font-semibold" style={{ color: textTitle }}>
                  {form.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setItemModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border"
                style={{ borderColor: borderCol, color: textSub, background: 'transparent' }}>
                Cancel
              </button>
              <button onClick={saveItem}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: '#F5B301', color: '#000' }}>
                {editItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}