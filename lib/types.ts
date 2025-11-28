export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  rating: number;
  image?: string;
  categoryId: string;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
}
