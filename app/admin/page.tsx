"use client";

import { useState, useEffect } from "react";
import { CategoryList } from "@/components/admin/CategoryList";
import { ItemList } from "@/components/admin/ItemList";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Category } from "@/lib/types";

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Menu Admin</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <CategoryList initialCategories={categories} onChange={fetchCategories} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
          <ItemList categories={categories} />
        </section>
      </div>
    </div>
  );
}
