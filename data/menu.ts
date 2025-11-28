export type Category = "Burgers" | "Pizza" | "Pasta" | "Drinks" | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: Category;
}

export const categories: Category[] = ["Burgers", "Pizza", "Pasta", "Drinks", "Desserts"];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty, cheddar cheese, lettuce, tomato, and house sauce on a brioche bun.",
    price: 12.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    category: "Burgers",
  },
  {
    id: "2",
    name: "Double Bacon Smash",
    description: "Two smashed patties, crispy bacon, american cheese, pickles, and onion.",
    price: 15.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
    category: "Burgers",
  },
  {
    id: "3",
    name: "Margherita Pizza",
    description: "San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
    price: 14.50,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    category: "Pizza",
  },
  {
    id: "4",
    name: "Pepperoni Feast",
    description: "Loaded with spicy pepperoni, mozzarella cheese, and tomato sauce.",
    price: 16.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    category: "Pizza",
  },
  {
    id: "5",
    name: "Truffle Carbonara",
    description: "Spaghetti, guanciale, pecorino romano, egg yolk, and black truffle shavings.",
    price: 18.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    category: "Pasta",
  },
  {
    id: "6",
    name: "Berry Mojito",
    description: "Fresh mint, lime juice, mixed berries, rum, and soda water.",
    price: 8.50,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
    category: "Drinks",
  },
  {
    id: "7",
    name: "Iced Latte",
    description: "Espresso shot poured over ice and cold milk.",
    price: 5.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80",
    category: "Drinks",
  },
  {
    id: "8",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
    price: 9.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    category: "Desserts",
  },
];
