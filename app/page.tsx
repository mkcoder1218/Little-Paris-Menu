"use client";

import { useState, useEffect, useMemo } from "react";
import { Category, MenuItem } from "@/lib/types";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { MenuCard } from "@/components/ui/MenuCard";
import { Drawer } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | "All">("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const catSnapshot = await getDocs(collection(db, "categories"));
        const cats = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        setCategories(cats);

        const itemSnapshot = await getDocs(collection(db, "menu"));
        const items = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[];
        
        items.sort((a, b) => {
            const orderA = a.order ?? Number.MAX_VALUE;
            const orderB = b.order ?? Number.MAX_VALUE;
            return orderA - orderB;
        });
        
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((item) => {
        if (!item.categoryId) return false;
        return item.categoryId === activeCategory;
    });
  }, [activeCategory, menuItems]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-slate-900" style={{ backgroundColor: 'var(--bg-color, #faf9f7)' }}>
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-3 border-gold-200 dark:border-gold-800 border-t-navy-800 dark:border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
              </div>
              <p className="text-navy-700 dark:text-cream-200 font-medium">Loading your menu...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-cream-50 dark:bg-slate-900 transition-colors duration-500" style={{ backgroundColor: 'var(--bg-color, #faf9f7)' }}>
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Header */}
      <header className="relative p-6 pt-10 pb-6 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 backdrop-blur-xl border-b-2 border-gold-400/30 transition-colors duration-300">
        {/* Decorative gold lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />
        
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Eiffel Tower Icon */}
              <svg className="w-8 h-8 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L10 8h4L12 2zm0 8l-2 6h4l-2-6zm-1 8l-1 4h4l-1-4h-2zm-3-14L6 8h2l2-4H8zm8 0l2 4h2l-2-4h-2zM6 10l-2 6h2l2-6H6zm12 0l2 6h2l-2-6h-2z"/>
              </svg>
              <h1 className="text-4xl md:text-5xl font-luxury text-gold-300 tracking-tight">
                Little Paris
              </h1>
            </div>
            <p className="text-cream-200 dark:text-cream-300 text-sm font-light flex items-center gap-2 ml-11">
              <span className="inline-block w-12 h-px bg-gold-400/50"></span>
              Authentic French Cuisine
              <span className="inline-block w-12 h-px bg-gold-400/50"></span>
            </p>
          </div>

        </div>
      </header>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Menu Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              index={index}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-2 text-center py-20"
          >
            <div className="relative inline-block">
              <div className="text-7xl mb-6">🍽️</div>
            </div>
            <p className="text-lg text-navy-600 dark:text-cream-300 font-medium mb-2">No items in this category</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please try another selection</p>
          </motion.div>
        )}
      </div>

      {/* Item Details Drawer */}
      <Drawer isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="px-6 pb-6">
            {/* Large Image */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-gold-300/20 dark:border-gold-600/20">
              {selectedItem.image ? (
                <>
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/20 to-transparent" />
                  
                  {/* Floating Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-navy-900/95 dark:bg-navy-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gold-400/40">
                    <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
                    <span className="text-lg font-bold text-gold-300">{selectedItem.rating}</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-2 text-gold-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-5">
              {/* Name and Price */}
              <div className="space-y-3">
                <h2 className="text-4xl font-luxury text-navy-900 dark:text-cream-50 leading-tight">
                  {selectedItem.name}
                </h2>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 dark:bg-navy-800 rounded-xl border border-gold-400/40 shadow-lg">
                  <span className="font-luxury text-3xl text-gold-300 font-bold">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="space-y-3 p-5 bg-cream-100/50 dark:bg-slate-800/50 rounded-xl border border-gold-300/20 dark:border-gold-600/20">
                  <h3 className="text-sm font-bold text-navy-700 dark:text-cream-200 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Description
                  </h3>
                  <p className="text-navy-600 dark:text-cream-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {/* Category */}
              <div className="flex items-center justify-between p-5 bg-cream-100/50 dark:bg-slate-800/50 rounded-xl border border-gold-300/20 dark:border-gold-600/20">
                <span className="text-sm font-bold text-navy-600 dark:text-cream-300 uppercase tracking-wider">Category</span>
                <span className="px-4 py-2 bg-navy-900 dark:bg-navy-800 rounded-lg text-sm font-semibold text-gold-300 border border-gold-400/30">
                  {categories.find(c => c.id === selectedItem.categoryId)?.name || "Uncategorized"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
