"use client";

import { mutate } from "swr";

export interface ProductColor {
  name: string;
  hex: string;
}
export interface Category {
  id: string;
  name: string;
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

const defaultProducts: Product[] = [];

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
