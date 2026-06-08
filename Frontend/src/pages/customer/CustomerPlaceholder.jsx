export default function CustomerPlaceholder({ title, subtitle }) {
  return (
    <div className="px-8 py-10 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-600 font-bold text-xs mb-4">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Coming Soon
        </div>
        <p className="text-gray-500 text-sm font-medium">
          This feature is under development and will be available shortly.
        </p>
      </div>
    </div>
  );
}
