import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAdminTheme } from '../../hooks/useAdminTheme';



export default function Pagination({ page, totalPages, onPageChange }) {

  const { inputBg, inputBorder, textTitle, navInactive } = useAdminTheme();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4);



  return (

    <div className="flex items-center gap-2">

      <button

        type="button"

        onClick={() => onPageChange(Math.max(1, page - 1))}

        disabled={page <= 1}

        className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer disabled:opacity-40"

        style={{ borderColor: inputBorder, background: inputBg, color: textTitle }}

      >

        <ChevronLeft size={16} />

      </button>

      {pages.map((p) => (

        <button

          key={p}

          type="button"

          onClick={() => onPageChange(p)}

          className="w-9 h-9 rounded-lg border text-sm font-bold cursor-pointer transition-all"

          style={{

            borderColor: p === page ? '#F5B301' : inputBorder,

            background: p === page ? 'rgba(245,179,1,0.12)' : inputBg,

            color: p === page ? '#F5B301' : navInactive,

          }}

        >

          {p}

        </button>

      ))}

      <button

        type="button"

        onClick={() => onPageChange(Math.min(totalPages, page + 1))}

        disabled={page >= totalPages}

        className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer disabled:opacity-40"

        style={{ borderColor: inputBorder, background: inputBg, color: textTitle }}

      >

        <ChevronRight size={16} />

      </button>

    </div>

  );

}


