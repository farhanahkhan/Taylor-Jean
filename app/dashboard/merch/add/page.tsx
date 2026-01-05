"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Upload, ImageIcon, X } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";

import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

export type Color = {
  id: string;
  name: string;
  hexCode: string;
};
export type Size = {
  id: string;
  sizeValue: string;
  createdDate: string;
  isActive: boolean;
};
export type Category = {
  id: string;
  name: string;
};

type SizeAPIResponse = {
  id: string;
  sizeValue: string;
  createdDate?: string;
  isActive?: boolean;
};

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizesFromAPI, setSizesFromAPI] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/merch?type=categories");
        const json = await res.json();
        if (!json.status || !Array.isArray(json.data)) return;
        setCategories(json.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    loadCategories();
  }, []);

  // Load colors
  useEffect(() => {
    async function loadColors() {
      try {
        const res = await fetch("/api/merch?type=colors");
        const json = await res.json();
        if (!json.status || !Array.isArray(json.data)) return;
        setColors(json.data);
      } catch (err) {
        console.error("Failed to fetch colors", err);
      }
    }
    loadColors();
  }, []);

  // Load sizes
  useEffect(() => {
    async function loadSizes() {
      try {
        const res = await fetch("/api/merch?type=sizes");
        const json = await res.json();
        if (!json.status || !Array.isArray(json.data)) return;
        const mappedSizes: Size[] = (json.data as SizeAPIResponse[]).map(
          (s) => ({
            id: s.id,
            sizeValue: s.sizeValue,
            createdDate: s.createdDate || new Date().toISOString(),
            isActive: s.isActive ?? true,
          })
        );
        setSizesFromAPI(mappedSizes);
      } catch (err) {
        console.error("Failed to fetch sizes", err);
      }
    }
    loadSizes();
  }, []);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((c) => c !== colorId)
        : [...prev, colorId]
    );
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // --- FINAL HANDLE SUBMIT ---
  const handleSubmit = async () => {
    if (!productName || !price || !category) {
      alert("Please fill product name, price and category");
      return;
    }

    const colorIds = selectedColors;
    const sizeIds = selectedSizes
      .map((s) => sizesFromAPI.find((sz) => sz.sizeValue === s)?.id)
      .filter(Boolean) as string[];

    // ✅ Always send a valid full URL to backend
    const finalImageUrl = "https://mobileapp.designswebs.com/placeholder.svg";

    try {
      const res = await fetch("/api/merch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          price: Number(price),
          categoryId: category,
          colorIds,
          sizeIds,
          description,
          imageUrl: finalImageUrl, // always valid URL
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || JSON.stringify(data));

      alert("Product Created Successfully!");
      router.push("/dashboard/merch");
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Failed to create product. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex flex-col items-center justify-center lg:w-full bg-gray-50">
          <main className="flex-1 p-4 md:p-6 lg:p-8 sm:w-[80%] lg:w-[80%] xl:w-[55%]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Merch Product
              </h1>
              <p className="text-gray-500 mt-1">
                Add a new item to your store inventory.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm max-w-4xl ">
              {/* Basic Info */}
              <div className="mb-8 space-y-4">
                <div>
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Name
                  </Label.Root>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Premium Cotton T-Shirt"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                      Price
                    </Label.Root>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category
                    </Label.Root>
                    <Select.Root value={category} onValueChange={setCategory}>
                      <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <Select.Value placeholder="Select an option" />
                        <Select.Icon>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                          <Select.Viewport className="p-1">
                            {categories.map((cat) => (
                              <Select.Item
                                key={cat.id}
                                value={cat.id}
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none rounded"
                              >
                                <Select.ItemText>{cat.name}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check className="h-4 w-4 text-primary" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                <div>
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </Label.Root>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Variants */}
              <div className="mb-8 space-y-4">
                <div>
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes
                  </Label.Root>
                  <div className="flex flex-wrap gap-2">
                    {sizesFromAPI.map((sizeObj) => (
                      <button
                        key={sizeObj.id}
                        onClick={() => toggleSize(sizeObj.sizeValue)}
                        className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                          selectedSizes.includes(sizeObj.sizeValue)
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {sizeObj.sizeValue}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </Label.Root>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => toggleColor(color.id)}
                        title={color.name}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColors.includes(color.id)
                            ? "ring-2 ring-offset-2 ring-slate-800 border-slate-800"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.hexCode }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </Label.Root>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          width={96}
                          height={96}
                        />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow"
                        >
                          <X className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-primary font-medium">
                        Upload a file
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => router.push("/dashboard/merch")}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!productName || !price || !category}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Product
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
