import { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Search, ChevronDown, Image as ImageIcon, X, Loader2,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { ownerService } from '../../services/api';

const EMPTY_ITEM = { name: '', price: '', image: '', category: '', description: '', isAvailable: true };

/**
 * Owner Menu Management — live CRUD for menu categories and items
 * belonging to the owner's restaurant (via /menu endpoints).
 */
export default function OwnerMenuPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const [itemModal, setItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);

  const [catModal, setCatModal] = useState(false);
  const [catName, setCatName] = useState('');

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e5e5';
  const inputColor = dark ? '#fff' : '#1a1a1a';

  const loadMenu = async (restaurantId) => {
    const [cats, its] = await Promise.all([
      ownerService.getCategories(restaurantId),
      ownerService.getItems(restaurantId),
    ]);
    setCategories(cats || []);
    setItems(its || []);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restaurants = await ownerService.getMyRestaurants();
        const primary = (restaurants || [])[0];
        if (!primary) { if (active) { setRestaurant(null); setLoading(false); } return; }
        if (!active) return;
        setRestaurant(primary);
        await loadMenu(primary._id);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const catId = item.category?._id || item.category;
      const matchCat = activeTab === 'all' || catId === activeTab;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeTab, search]);

  const itemCountFor = (catId) =>
    items.filter((i) => (i.category?._id || i.category) === catId).length;

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_ITEM, category: activeTab !== 'all' ? activeTab : (categories[0]?._id || '') });
    setItemModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: item.price,
      image: item.image?.url || '',
      category: item.category?._id || item.category,
      description: item.description || '',
      isAvailable: item.isAvailable,
    });
    setItemModal(true);
  };

  const saveItem = async () => {
    if (!form.name || !form.price || !form.category) {
      setError('Name, price and category are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        restaurant: restaurant._id,
        category: form.category,
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        isAvailable: form.isAvailable,
        image: form.image ? { url: form.image } : undefined,
      };
      if (editItem) {
        await ownerService.updateItem(editItem._id, payload);
      } else {
        await ownerService.createItem(payload);
      }
      await loadMenu(restaurant._id);
      setItemModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await ownerService.deleteItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const toggleAvailable = async (item) => {
    try {
      await ownerService.updateItem(item._id, { isAvailable: !item.isAvailable });
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i)));
    } catch (err) {
      alert(err.message || 'Failed to update item');
    }
  };

  const saveCategory = async () => {
    if (!catName.trim()) return;
    try {
      await ownerService.createCategory({ restaurant: restaurant._id, name: catName.trim() });
      setCatName('');
      setCatModal(false);
      await loadMenu(restaurant._id);
    } catch (err) {
      alert(err.message || 'Failed to create category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen p-8" style={{ background: bg }}>
        <div className="max-w-lg mx-auto rounded-3xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
          You don&apos;t have a registered restaurant yet.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Menu Management</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Create and manage {restaurant.name}&apos;s menu</p>
        </div>
      </div>

      {error && <div className="mb-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="p-4 border-b" style={{ borderColor: borderCol }}>
              <span className="text-sm font-bold" style={{ color: textTitle }}>Categories</span>
            </div>
            <button onClick={() => setActiveTab('all')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left border-b cursor-pointer"
              style={{ borderColor: borderCol, background: activeTab === 'all' ? 'rgba(245,179,1,0.08)' : 'transparent', color: activeTab === 'all' ? '#F5B301' : textSub }}>
              <span>🍽️</span>
              <span className="flex-1">All Items</span>
              <span className="text-xs">{items.length}</span>
            </button>
            {categories.map((cat) => (
              <button key={cat._id} onClick={() => setActiveTab(cat._id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left border-b cursor-pointer"
                style={{ borderColor: borderCol, background: activeTab === cat._id ? 'rgba(245,179,1,0.08)' : 'transparent', color: activeTab === cat._id ? '#F5B301' : textTitle }}>
                <span className="flex-1">{cat.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: dark ? 'rgba(255,255,255,0.07)' : '#f0f0f0', color: textSub }}>
                  {itemCountFor(cat._id)}
                </span>
              </button>
            ))}
            <button onClick={() => setCatModal(true)} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold cursor-pointer" style={{ color: '#F5B301', background: 'transparent', border: 'none' }}>
              <Plus size={14} /> Add Category
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
              <input type="text" placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
                style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ml-auto border-none cursor-pointer" style={{ background: '#F5B301', color: '#000' }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ background: cardBg, borderColor: borderCol }}>
              <UtensilsCrossed size={40} style={{ color: textSub }} className="mb-3 opacity-40" />
              <p className="font-bold" style={{ color: textTitle }}>No items found</p>
              <p className="text-sm mt-1 mb-4" style={{ color: textSub }}>Add your first menu item</p>
              <button onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-bold border-none cursor-pointer" style={{ background: '#F5B301', color: '#000' }}>
                <Plus size={14} className="inline mr-1.5" /> Add Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item._id} className="rounded-2xl border overflow-hidden group" style={{ background: cardBg, borderColor: borderCol }}>
                  <div className="relative h-36 overflow-hidden">
                    {item.image?.url
                      ? <img src={item.image.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
                          <ImageIcon size={28} style={{ color: textSub }} className="opacity-30" />
                        </div>}
                    <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: item.isAvailable ? 'rgba(34,197,94,0.9)' : 'rgba(248,113,113,0.9)', color: '#fff' }}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-sm leading-tight" style={{ color: textTitle }}>{item.name}</h3>
                      <span className="font-black text-sm flex-shrink-0" style={{ color: '#F5B301' }}>${Number(item.price).toFixed(2)}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: textSub }}>{item.description}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleAvailable(item)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-1 border-none cursor-pointer"
                        style={{ background: item.isAvailable ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', color: item.isAvailable ? '#22c55e' : '#f87171' }}>
                        {item.isAvailable ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {item.isAvailable ? 'On' : 'Off'}
                      </button>
                      <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                        <Pencil size={13} style={{ color: textSub }} />
                      </button>
                      <button onClick={() => deleteItem(item._id)} className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
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

      {/* Add/Edit item modal */}
      {itemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setItemModal(false)}>
          <div className="rounded-2xl border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: cardBg, borderColor: borderCol }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setItemModal(false)} className="bg-transparent border-none cursor-pointer" style={{ color: textSub }}><X size={20} /></button>
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
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
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
                <button type="button" onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))} className="bg-transparent border-none cursor-pointer">
                  {form.isAvailable ? <ToggleRight size={24} style={{ color: '#22c55e' }} /> : <ToggleLeft size={24} style={{ color: '#94a3b8' }} />}
                </button>
                <span className="text-sm font-semibold" style={{ color: textTitle }}>{form.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setItemModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border cursor-pointer" style={{ borderColor: borderCol, color: textSub, background: 'transparent' }}>Cancel</button>
              <button onClick={saveItem} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: '#F5B301', color: '#000' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add category modal */}
      {catModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setCatModal(false)}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: cardBg, borderColor: borderCol }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>Add Category</h2>
              <button onClick={() => setCatModal(false)} className="bg-transparent border-none cursor-pointer" style={{ color: textSub }}><X size={20} /></button>
            </div>
            <input type="text" placeholder="Category name (e.g. Desserts)" value={catName} onChange={(e) => setCatName(e.target.value)}
              className="w-full rounded-xl text-sm outline-none px-4 py-2.5 mb-4"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
            <button onClick={saveCategory} className="w-full py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer" style={{ background: '#F5B301', color: '#000' }}>Add Category</button>
          </div>
        </div>
      )}
    </div>
  );
}
