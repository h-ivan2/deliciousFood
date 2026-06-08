import { motion, AnimatePresence } from 'framer-motion';

import { AlertCircle, X } from 'lucide-react';

import { useAdminTheme } from '../../hooks/useAdminTheme';



export default function DeleteRestaurantModal({ open, onClose, onConfirm }) {

  const { modalBg, borderCol, textTitle, textSub, inputBg, inputBorder } = useAdminTheme();



  return (

    <AnimatePresence>

      {open && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="absolute inset-0 bg-black/50"

            onClick={onClose}

          />

          <motion.div

            initial={{ opacity: 0, scale: 0.95 }}

            animate={{ opacity: 1, scale: 1 }}

            exit={{ opacity: 0, scale: 0.95 }}

            className="relative rounded-2xl w-full max-w-md p-8 shadow-2xl text-center border"

            style={{ background: modalBg, borderColor: borderCol }}

          >

            <button

              type="button"

              onClick={onClose}

              className="absolute top-4 right-4 border-none bg-transparent cursor-pointer"

              style={{ color: textTitle }}

            >

              <X size={20} />

            </button>

            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">

              <AlertCircle size={28} className="text-red-500" />

            </div>

            <h3 className="font-black text-xl mb-2" style={{ color: textTitle }}>

              Delete Restaurant

            </h3>

            <p className="text-sm leading-relaxed mb-1" style={{ color: textSub }}>

              Are you sure you want to delete the restaurant

            </p>

            <p className="text-sm mb-8" style={{ color: textSub }}>

              This action can&apos;t be undone

            </p>

            <div className="flex gap-4 justify-center">

              <button

                type="button"

                onClick={onClose}

                className="px-8 py-3 rounded-xl font-bold text-sm border cursor-pointer"

                style={{ borderColor: inputBorder, background: inputBg, color: textTitle }}

              >

                Cancel

              </button>

              <button

                type="button"

                onClick={onConfirm}

                className="px-8 py-3 rounded-xl font-bold text-sm border-none cursor-pointer text-white"

                style={{ background: '#f87171' }}

              >

                Delete

              </button>

            </div>

          </motion.div>

        </div>

      )}

    </AnimatePresence>

  );

}


