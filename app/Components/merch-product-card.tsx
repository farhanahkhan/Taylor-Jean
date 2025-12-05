"use client";

import Image from "next/image";

interface ProductColor {
  name: string;
  hex: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  colors: ProductColor[];
  sizes: string[];
}

export function MerchProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{product.category}</span>
          <span className="font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <h3 className="font-medium text-gray-900 truncate mb-3">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.map((color) => (
            <button
              key={color.name}
              title={color.name}
              className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {product.sizes.map((size) => (
            <button
              key={size}
              className="px-2 py-1 text-xs font-medium border border-gray-200 rounded hover:border-gray-400 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
