import { Search, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';

import { TABLE_BG_IMAGE } from '../../utils/adminRestaurantData';

import { useAdminTheme } from '../../hooks/useAdminTheme';

import Pagination from './Pagination';



function StatusBadge({ status }) {

  const styles = {

    pending: { bg: 'rgba(245,179,1,0.15)', color: '#d97706', label: 'Pending' },

    approved: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a', label: 'Approved' },

    rejected: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', label: 'Rejected' },

  };

  const s = styles[status] || styles.pending;

  return (

    <span className="text-xs font-bold px-3 py-1 rounded-md" style={{ background: s.bg, color: s.color }}>

      {s.label}

    </span>

  );

}



export default function RestaurantTablePanel({

  search,

  onSearchChange,

  children,

  footer,

  pagination,

  onPageChange,

}) {

  const { textSub, borderCol, inputBg, inputBorder, inputColor, tableOverlay, tableHeadBg, textTitle } = useAdminTheme();



  return (

    <div className="flex flex-col gap-5">

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">

        <div className="relative flex-1 max-w-2xl">

          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />

          <input

            type="text"

            value={search}

            onChange={(e) => onSearchChange(e.target.value)}

            placeholder="Search for restaurants or owner...."

            className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none border"

            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}

          />

        </div>

        <button

          type="button"

          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-semibold cursor-pointer"

          style={{ borderColor: inputBorder, color: textTitle, background: inputBg }}

        >

          <SlidersHorizontal size={16} />

          Filters

          <ChevronDown size={14} />

        </button>

      </div>



      <div className="rounded-2xl border overflow-hidden relative" style={{ borderColor: borderCol }}>

        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${TABLE_BG_IMAGE})` }} />

        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: tableOverlay }} />

        <div className="relative overflow-x-auto">{children}</div>

        <div

          className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t"

          style={{ borderColor: borderCol, background: tableHeadBg }}

        >

          <p className="text-sm font-medium" style={{ color: textSub }}>

            {footer}

          </p>

          {pagination && (

            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={onPageChange} />

          )}

        </div>

      </div>

    </div>

  );

}



export function ApproveTableRow({ rest, image, dateLabel, onApprove, onReject, onRowClick }) {

  const { borderCol, textTitle, textSub, inputBg, tableRowHover } = useAdminTheme();



  return (

    <tr

      className="border-b cursor-pointer transition-colors"

      style={{ borderColor: borderCol }}

      onClick={onRowClick}

      onMouseEnter={(e) => { e.currentTarget.style.background = tableRowHover; }}

      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}

    >

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />

          <span className="font-bold text-sm" style={{ color: textTitle }}>

            {rest.name}

          </span>

        </div>

      </td>

      <td className="px-6 py-4 text-sm" style={{ color: textSub }}>

        {rest.owner?.name}

      </td>

      <td className="px-6 py-4 text-sm" style={{ color: textSub }}>

        {rest.restaurantType || rest.cuisineType?.split(',')[0]}

      </td>

      <td className="px-6 py-4 text-sm" style={{ color: textSub }}>

        {dateLabel}

      </td>

      <td className="px-6 py-4">

        <StatusBadge status={rest.status || 'pending'} />

      </td>

      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center gap-2">

          <button

            type="button"

            onClick={onApprove}

            className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors"

            style={{ borderColor: '#86efac', background: inputBg }}

            title="Approve"

          >

            <Check size={18} className="text-green-600" strokeWidth={2.5} />

          </button>

          <button

            type="button"

            onClick={onReject}

            className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors"

            style={{ borderColor: '#fca5a5', background: inputBg }}

            title="Reject"

          >

            <X size={18} className="text-red-500" strokeWidth={2.5} />

          </button>

        </div>

      </td>

    </tr>

  );

}



export function AllRestaurantsTableRow({ rest, image, onEdit, onView, onDelete }) {

  const { borderCol, textTitle, textSub, tableRowHover } = useAdminTheme();



  return (

    <tr

      className="border-b transition-colors"

      style={{ borderColor: borderCol }}

      onMouseEnter={(e) => { e.currentTarget.style.background = tableRowHover; }}

      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}

    >

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover" />

          <span className="font-bold text-sm" style={{ color: textTitle }}>

            {rest.name}

          </span>

        </div>

      </td>

      <td className="px-6 py-4 text-sm" style={{ color: textSub }}>

        {rest.owner?.name}

      </td>

      <td className="px-6 py-4 text-sm" style={{ color: textSub }}>

        {rest.restaurantType || rest.cuisineType?.split(',')[0]}

      </td>

      <td className="px-6 py-4">

        <StatusBadge status={rest.status || 'approved'} />

      </td>

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <button type="button" onClick={onEdit} className="border-none bg-transparent cursor-pointer p-1 hover:text-[#F5B301]" style={{ color: textSub }} title="Edit">

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>

          </button>

          <button type="button" onClick={onView} className="border-none bg-transparent cursor-pointer p-1 hover:text-[#F5B301]" style={{ color: textSub }} title="View">

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

          </button>

          <button type="button" onClick={onDelete} className="border-none bg-transparent cursor-pointer text-red-400 hover:text-red-600 p-1" title="Delete">

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>

          </button>

        </div>

      </td>

    </tr>

  );

}



export { StatusBadge };


