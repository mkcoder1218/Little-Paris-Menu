"use client";

import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | "All";
  onSelectCategory: (categoryId: string | "All") => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="relative overflow-x-auto no-scrollbar sticky top-0 z-10 bg-cream-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gold-300/20 dark:border-gold-600/20">
      {/* Elegant decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      
      <div className="flex gap-2 p-4">
        {/* All Button */}
        <button
          onClick={() => onSelectCategory("All")}
          className={cn(
            "relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden",
            activeCategory === "All" 
              ? "text-cream-50 shadow-lg scale-105 border border-gold-400/50" 
              : "text-navy-700 dark:text-cream-200 hover:text-navy-900 dark:hover:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-gold-300/30"
          )}
        >
          {activeCategory === "All" && (
            <>
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-navy-900 dark:bg-navy-800 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gold-400/10 -z-10" />
            </>
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            All
          </span>
        </button>

        {/* Category Buttons */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden font-luxury",
              activeCategory === cat.id 
                ? "text-cream-50 shadow-lg scale-105 border border-gold-400/50" 
                : "text-navy-700 dark:text-cream-200 hover:text-navy-900 dark:hover:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-gold-300/30"
            )}
          >
            {activeCategory === cat.id && (
              <>
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-navy-900 dark:bg-navy-800 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gold-400/10 -z-10" />
              </>
            )}
            <span className="relative z-10">{cat.name}</span>
          </button>
        ))}
      </div>
      
      {/* Subtle fade for scrolling */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-cream-50 dark:from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
}
