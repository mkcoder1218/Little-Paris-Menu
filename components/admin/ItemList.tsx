"use client";

import { useState, useEffect, useRef } from "react";
import { MenuItem, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  Camera,
  Image,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import {
  addItemFirebase,
  deleteItemFirebase,
  fetchItems,
  updateItemFirebase,
  updateItemsOrderFirebase,
} from "@/lib/menuService";

interface ItemListProps {
  categories: Category[];
}

// Sortable Item Component
function SortableItem({
  item,
  categoryName,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  categoryName: string;
  onEdit: (i: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="mb-2 touch-none">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-500 hover:text-slate-300 p-1"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="h-12 w-12 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                No Img
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate text-slate-100">{item.name}</h4>
            <div className="text-sm text-slate-400 flex flex-wrap gap-2 items-center">
              <span className="font-semibold text-slate-200">
                ${item.price.toFixed(2)}
              </span>
              <span className="truncate max-w-[100px]">{categoryName}</span>
              <span>★ {item.rating}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(item)}>
              <Pencil className="h-4 w-4 text-slate-400 hover:text-slate-200" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ItemList({ categories }: ItemListProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageSourceChoice, setShowImageSourceChoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    rating: 5,
    image: "",
    categoryId: categories[0]?.id || "",
  });

  // Load items
  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    }
    loadItems();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    try {
      await updateItemsOrderFirebase(newItems);
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("/api/uploads", fd);
      setImagePreview(res.data.url);
      setFormData({ ...formData, image: res.data.url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: 0,
      rating: 5,
      image: "",
      categoryId: categories[0]?.id || "",
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setImagePreview(item.image || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined || !formData.categoryId) {
      console.error("Validation failed", formData);
      return;
    }
    setLoading(true);
    try {
      console.log("Starting save process...", formData);
      if (editingItem) {
        console.log("Updating existing item:", editingItem.id);
        const updated = { ...editingItem, ...formData } as MenuItem;
        setItems(items.map((i) => (i.id === editingItem.id ? updated : i)));
        await updateItemFirebase(editingItem.id, formData);
        console.log("Item updated successfully");
      } else {
        console.log("Adding new item...");
        const added = await addItemFirebase(formData as Omit<MenuItem, "id">);
        console.log("Item added successfully:", added);
        setItems([...items, added]);
      }
      console.log("Closing modal...");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save item:", err);
      console.error("Error details:", err.message, err.stack);
      alert(`Failed to save item: ${err.message}`);
    } finally {
      console.log("Save process complete");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      setItems(items.filter((i) => i.id !== id));
      await deleteItemFirebase(id);
    } catch (err) {
      console.error("Failed to delete item", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={openAddModal} disabled={categories.length === 0}>
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
      {categories.length === 0 && (
        <p className="text-red-500 text-sm">Please create categories first.</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              categoryName={
                categories.find((c) => c.id === item.categoryId)?.name ||
                "Unknown"
              }
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview && (
              <div className="w-full h-48 relative">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 p-2 rounded-full"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: "" });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="mr-2 h-5 w-5" /> Camera
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="mr-2 h-5 w-5" /> Device
              </Button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
