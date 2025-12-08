"use client";

import { mutate } from "swr";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  colors: ProductColor[];
  sizes: string[];
  description?: string;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Taylor Jean Fishing Cap",
    price: 35.0,
    category: "Accessories",
    image: "/navy-blue-fishing-cap-with-boat-logo-embroidered.jpg",
    colors: [
      { name: "Navy", hex: "#1E3A5F" },
      { name: "White", hex: "#FFFFFF" },
    ],
    sizes: ["One Size"],
  },
  {
    id: "2",
    name: "Sport Fishing Polo",
    price: 65.0,
    category: "Clothing",
    image: "/yellow-polo-shirt-with-fishing-boat-emblem.jpg",
    colors: [
      { name: "Yellow", hex: "#F5B800" },
      { name: "Navy", hex: "#1E3A5F" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "3",
    name: "Tournament Hoodie",
    price: 95.0,
    category: "Clothing",
    image: "/gray-hoodie-with-fishing-tournament-logo-marlin.jpg",
    colors: [
      { name: "Gray", hex: "#6B7280" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "4",
    name: "Marlin Tackle Bag",
    price: 120.0,
    category: "Gear",
    image: "/navy-waterproof-fishing-tackle-bag-boat-gear.jpg",
    colors: [
      { name: "Navy", hex: "#1E3A5F" },
      { name: "Orange", hex: "#F97316" },
    ],
    sizes: ["M", "L"],
  },
  {
    id: "5",
    name: "Deep Sea Fishing Tee",
    price: 45.0,
    category: "Clothing",
    image: "/white-t-shirt-with-vintage-fishing-boat-graphic.jpg",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1E3A5F" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "6",
    name: "Captain Sunglasses",
    price: 85.0,
    category: "Accessories",
    image: "/polarized-fishing-sunglasses-sport-style.jpg",
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Tortoise", hex: "#8B4513" },
    ],
    sizes: ["One Size"],
  },
  {
    id: "7",
    name: "Offshore Windbreaker",
    price: 125.0,
    category: "Clothing",
    image: "/yellow-waterproof-fishing-windbreaker-jacket.jpg",
    colors: [
      { name: "Yellow", hex: "#F5B800" },
      { name: "Navy", hex: "#1E3A5F" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: "8",
    name: "Fishing Rod Holder Belt",
    price: 55.0,
    category: "Gear",
    image: "/leather-fishing-rod-holder-belt-accessory.jpg",
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["S", "M", "L"],
  },
];

let products: Product[] = [...defaultProducts];

export function getProducts(): Product[] {
  return products;
}

export function addProduct(product: Omit<Product, "id">): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  products = [newProduct, ...products];
  mutate("products");
  return newProduct;
}

export function useProducts() {
  return {
    products,
    addProduct,
  };
}
