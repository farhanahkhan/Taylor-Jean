"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { Search, Grid3X3, Plus, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { getCategories } from "../../../lib/product-store";

// import { getProducts } from "../../../lib/product-store";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { MerchProductCard } from "@/app/Components/merch-product-card";
import { Product, Category } from "@/lib/product-store";

const sortOptions = [
  "Newest First",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
];
interface ApiColor {
  id: string;
  name: string;
  hexCode: string;
  isActive: boolean;
}

interface ApiSize {
  id: string;
  sizeValue: string;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  imageUrl: string | null;
  colors: ApiColor[] | null;
  sizes: ApiSize[] | null;
}
interface ApiResponse<T> {
  status: boolean;
  data: T;
}
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("/api/merch?type=products");
  const json: ApiResponse<ApiProduct[]> = await res.json();

  if (!json.status || !Array.isArray(json.data)) return [];

  return json.data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.categoryName,
    image:
      p.imageUrl &&
      (p.imageUrl.startsWith("http") || p.imageUrl.startsWith("/"))
        ? p.imageUrl
        : "/placeholder.svg",
    colors: Array.isArray(p.colors)
      ? p.colors.map((c) => ({
          name: c.name,
          hex: c.hexCode,
        }))
      : [],
    sizes: Array.isArray(p.sizes) ? p.sizes.map((s) => s.sizeValue) : [],
  }));
};

export default function MerchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedSort, setSelectedSort] = useState<string>("Newest First");
  const [categories, setCategories] = useState<Category[]>([]);

  const { data: products = [], isLoading } = useSWR("products", fetchProducts);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/merch?type=categories");
        const json = await res.json();

        if (!json.status || !Array.isArray(json.data)) {
          setCategories([]);
          return;
        }

        setCategories(
          json.data.map((c: { id: string; name: string }) => ({
            id: c.id,
            name: c.name,
          }))
        );
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "Price: Low to High") return a.price - b.price;
    if (selectedSort === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  const sortOptions = [
    "Newest First",
    "Price: Low to High",
    "Price: High to Low",
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 bg-gray-50 p-4 md:p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Catalog
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your product inventory, track stock, and update listings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Grid3X3 className="h-4 w-4" />
                Products
              </button>
              <button
                onClick={() => router.push("/dashboard/merch/add")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Category Filter */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                      {selectedCategory}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[160px] z-50"
                      sideOffset={5}
                    >
                      {categories.map((category) => (
                        <DropdownMenu.Item
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          {category.name}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                {/* {categories.map((category) => (
                  <DropdownMenu.Item
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                  >
                    {category.name}
                  </DropdownMenu.Item>
                ))} */}

                {/* Sort Filter */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                      {selectedSort}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[180px] z-50"
                      sideOffset={5}
                    >
                      {sortOptions.map((option) => (
                        <DropdownMenu.Item
                          key={option}
                          onClick={() => setSelectedSort(option)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          {option}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading && (
            <p className="text-center text-gray-500 py-10">
              Loading products...
            </p>
          )}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <MerchProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
