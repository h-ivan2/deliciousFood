import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Percent, Tag, Clock, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { offerService } from '../../services/api';

/**
 * Customer Offers page — shows all currently active promotional offers
 * pulled from the live /offers endpoint.
 */
export default function OffersPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    offerService
      .getActiveOffers()
      .then((list) => setOffers(list || []))
      .catch((err) => setError(err.message || 'Failed to load offers'))
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const formatDiscount = (o) =>
    o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `$${o.discountValue} OFF`;

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';

  return (
    <div className="px-6 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display font-black text-3xl flex items-center gap-3" style={{ color: textColor }}>
          <Percent size={28} className="text-amber-500" /> Special Offers
        </h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>Exclusive deals and promotions from your favorite restaurants.</p>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 size={36} className="animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
            {error}
          </div>
        ) : offers.length === 0 ? (
          <div className="mt-12 rounded-3xl border p-16 text-center flex flex-col items-center gap-4" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,179,1,0.12)' }}>
              <Sparkles size={28} className="text-amber-500" />
            </div>
            <h3 className="font-extrabold text-lg" style={{ color: textColor }}>No active offers right now</h3>
            <p className="text-sm max-w-sm" style={{ color: textSub }}>
              Check back soon — restaurants add new deals all the time.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const r = offer.restaurant;
              return (
                <div
                  key={offer._id}
                  className="rounded-3xl border overflow-hidden flex flex-col shadow-sm relative"
                  style={{ background: cardBg, borderColor: borderCol }}
                >
                  {/* Discount banner */}
                  <div className="relative h-28 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 flex items-center justify-center">
                    {offer.image?.url && (
                      <img src={offer.image.url} alt={offer.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    )}
                    <div className="relative text-center">
                      <div className="text-3xl font-black text-black leading-none">{formatDiscount(offer)}</div>
                      {offer.minOrderAmount > 0 && (
                        <div className="text-[10px] font-bold text-black/70 mt-1">on orders over ${offer.minOrderAmount}</div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-extrabold text-base" style={{ color: textColor }}>{offer.title}</h3>
                    {offer.description && <p className="text-xs" style={{ color: textSub }}>{offer.description}</p>}
                    {r?.name && (
                      <div className="flex items-center gap-1.5 text-xs font-bold mt-1" style={{ color: '#F5B301' }}>
                        <Tag size={13} /> {r.name}
                      </div>
                    )}
                    {offer.validUntil && (
                      <div className="flex items-center gap-1.5 text-[11px]" style={{ color: textSub }}>
                        <Clock size={12} /> Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </div>
                    )}

                    <div className="mt-auto pt-4 flex items-center gap-2">
                      {offer.code && (
                        <button
                          onClick={() => copyCode(offer.code)}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black border border-dashed cursor-pointer"
                          style={{ borderColor: '#F5B301', color: '#F5B301', background: 'rgba(245,179,1,0.06)' }}
                        >
                          {copiedCode === offer.code ? <Check size={14} /> : <Copy size={14} />}
                          {copiedCode === offer.code ? 'Copied!' : offer.code}
                        </button>
                      )}
                      {r?._id && (
                        <button
                          onClick={() => navigate(`/restaurant/${r._id}/menu`)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black"
                        >
                          Order Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
