import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { MenuItem } from "@/lib/types";

const itemsCollection = collection(db, "menu");

export const fetchItems = async (): Promise<MenuItem[]> => {
  const snapshot = await getDocs(itemsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MenuItem[];
};

export const addItemFirebase = async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
  // Get the current max order to append to the end
  const snapshot = await getDocs(itemsCollection);
  const count = snapshot.size;
  
  const newItem = { ...item, order: count };
  const docRef = await addDoc(itemsCollection, newItem);
  return { id: docRef.id, ...newItem };
};

export const updateItemFirebase = async (id: string, updates: Partial<MenuItem>) => {
  const docRef = doc(db, "items", id);
  await updateDoc(docRef, updates);
};

export const deleteItemFirebase = async (id: string) => {
  const docRef = doc(db, "items", id);
  await deleteDoc(docRef);
};

export const updateItemsOrderFirebase = async (items: MenuItem[]) => {
  const batch = writeBatch(db);
  items.forEach((item, index) => {
    const docRef = doc(db, "items", item.id);
    batch.update(docRef, { order: index });
  });
  await batch.commit();
};
