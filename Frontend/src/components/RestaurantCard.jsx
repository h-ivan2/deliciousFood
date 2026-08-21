import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Icons } from './ui';

export default function RestaurantCard({ img, name, rating, reviews, time, delay = 0 }) {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className={`rounded-2xl overflow-hidden cursor-pointer ${dark ? 'glass-dark' : 'glass-light'}`}
      style={{ boxShadow: hovered ? '0 24px 48px rgba(0,0,0,0.25)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/browse')}
    >
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <motion.img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer backdrop-blur-md transition-colors duration-200"
          style={{ background: liked ? 'rgba(245,179,1,0.9)' : 'rgba(0,0,0,0.5)', color: liked ? '#000' : '#fff' }}
        >
          <Icons.Heart filled={liked} />
        </motion.button>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
      </div>

      <div className="p-4 pb-5">
        <h3 className="font-bold text-base mb-2">{name}</h3>
        <div className={`flex items-center justify-between text-xs ${dark ? 'text-white/55' : 'text-gray-500'}`}>
          <div className="flex items-center gap-1.5">
            <Icons.Star />
            <span className="text-accent font-bold text-sm">{rating}</span>
            <span>({reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Clock />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
