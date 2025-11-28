"use client";

import { MenuItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import Image from "next/image";
import { forwardRef } from "react";

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onClick?: () => void;
}

export const MenuCard = forwardRef<HTMLDivElement, MenuCardProps>(({ item, index, onClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative flex flex-col h-full overflow-hidden bg-white dark:bg-slate-800 rounded-xl group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 dark:border-white/5"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <Sparkles className="w-8 h-8" />
          </div>
        )}
        
        {/* Rating Badge - Floating on Image */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-sm">
          <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
          <span className="text-xs font-bold text-navy-900 dark:text-gold-300">{item.rating}</span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <h3 className="font-luxury text-lg text-navy-900 dark:text-cream-50 leading-tight line-clamp-2 group-hover:text-gold-500 transition-colors duration-300">
            {item.name}
          </h3>
        </div>
        
        {item.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        )}
        
        {/* Price Section */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-luxury text-lg text-navy-900 dark:text-gold-300 font-semibold">
            ETB {item.price.toFixed(2)}
          </span>
          
          {/* Add Button / Arrow */}
         
        </div>
      </div>
    </motion.div>
  );
});

MenuCard.displayName = "MenuCard";
