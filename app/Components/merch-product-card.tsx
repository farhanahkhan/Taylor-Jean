// "use client";

// import Image from "next/image";
// import Router from "next/router";

// interface ProductColor {
//   name: string;
//   hex: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
//   image: string;
//   colors: ProductColor[];
//   sizes: string[];
// }

// export function MerchProductCard({
//   product,
// }: {
//   product: Product;
//   onDelete: (id: string) => void;
// }) {
//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       <div className="relative aspect-square bg-gray-100">
//         <Image
//           src={product.image || "/placeholder.svg"}
//           alt={product.name}
//           fill
//           className="object-cover"
//         />
//       </div>
//       <div className="p-4">
//         <div className="flex items-center justify-between mb-1">
//           <span className="text-xs text-gray-500">{product.category}</span>
//           <span className="font-semibold text-gray-900">
//             ${product.price.toFixed(2)}
//           </span>
//         </div>
//         <h3 className="font-medium text-gray-900 truncate mb-3">
//           {product.name}
//         </h3>

//         <div className="flex items-center gap-1.5 mb-3">
//           {product.colors.map((color) => (
//             <button
//               key={color.name}
//               title={color.name}
//               className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
//               style={{ backgroundColor: color.hex }}
//             />
//           ))}
//         </div>

//         <div className="flex items-center gap-1.5">
//           {product.sizes.map((size) => (
//             <button
//               key={size}
//               className="px-2 py-1 text-xs font-medium border border-gray-200 rounded hover:border-gray-400 transition-colors"
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//         <button
//           // onClick={() => onDelete(product.id)}
//           className="text-red-500 text-sm hover:text-red-700"
//         >
//           Delete
//         </button>

//         <button
//           onClick={() => Router.push(`/team/merch/add?id=${product.id}`)}
//           className="text-blue-500 text-sm ml-2"
//         >
//           Edit
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import edit from "../../public/edit.svg";
import deletes from "../../public/delete.svg";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
} from "lucide-react";

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

interface MerchProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function MerchProductCard({ product, onDelete }: MerchProductCardProps) {
  const router = useRouter();

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
              type="button"
              className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className="px-2 py-1 text-xs font-medium border border-gray-200 rounded hover:border-gray-400 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="bg-white border rounded-lg shadow-lg p-1">
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/team/merch/add/${product.id}`);
                }}
                className="px-3 py-2 flex gap-2 hover:bg-gray-100 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => onDelete(product.id)}
                className="px-3 py-2 flex gap-2 hover:bg-red-50 text-red-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="text-red-500 text-sm hover:text-red-700"
          >
            <Image src={edit} alt="" className="w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/team/merch/add/${product.id}`);
            }}
            className="text-blue-500 text-sm hover:text-blue-700"
          >
            <Image src={deletes} alt="" className="w-5" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
