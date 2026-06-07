import { useAdminTheme } from '../../hooks/useAdminTheme';

export default function AdminPlaceholder({ title, subtitle }) {
  const { bg, cardBg, textTitle, textSub, borderCol } = useAdminTheme();

  return (
    <div className="px-8 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      <h1 className="font-display font-black text-3xl" style={{ color: textTitle }}>
        {title}
      </h1>
      <p className="text-sm mt-2" style={{ color: textSub }}>
        {subtitle}
      </p>
      <div
        className="mt-12 rounded-2xl border p-16 text-center"
        style={{ background: cardBg, borderColor: borderCol, color: textSub }}
      >
        Coming soon — connect to backend when ready.
      </div>
    </div>
  );
}
