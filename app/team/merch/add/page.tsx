"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Upload, ImageIcon, X } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";

import ImageUploader from "@/app/Components/ImageUploader";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { TeamHeader } from "@/app/Components/team-header";

export type TeamMember = {
  id: string;
  name: string;
  displayName?: string;
};

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

type ProductVariant = {
  sizeId: string;
  colorId: string;
  stockQuantity: number;
};
type ProductDetail = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  imageUrl: string;
  generalTeamId: string;
  variants: ProductVariant[];
};
export default function AddProductPage({ editId }: { editId?: string }) {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [colors, setColors] = useState<Color[]>([]);
  const [sizesFromAPI, setSizesFromAPI] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [variants, setVariants] = useState([
    {
      sizes: [] as string[], // store size IDs
      colors: [] as string[], // store color IDs
      quantity: "",
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // --- Variant Handlers ---
  const toggleSizeVariant = (variantIndex: number, sizeId: string) => {
    const updated = [...variants];
    const sizes = updated[variantIndex].sizes;
    if (sizes.includes(sizeId)) {
      updated[variantIndex].sizes = sizes.filter((s) => s !== sizeId);
    } else {
      updated[variantIndex].sizes = [...sizes, sizeId];
    }
    setVariants(updated);
  };

  const toggleColorVariant = (variantIndex: number, colorId: string) => {
    const updated = [...variants];
    const colors = updated[variantIndex].colors;
    if (colors.includes(colorId)) {
      updated[variantIndex].colors = colors.filter((c) => c !== colorId);
    } else {
      updated[variantIndex].colors = [...colors, colorId];
    }
    setVariants(updated);
  };

  const updateQuantity = (index: number, value: string) => {
    const updated = [...variants];
    updated[index].quantity = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { sizes: [], colors: [], quantity: "" }]);
  };

  // --- Load Data ---
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
          }),
        );
        setSizesFromAPI(mappedSizes);
      } catch (err) {
        console.error("Failed to fetch sizes", err);
      }
    }
    loadSizes();
  }, []);

  // --- Handle Submit ---
  const handleSubmit = async () => {
    if (!uploadedImageUrl) {
      alert("Please upload product image");
      return;
    }

    const mappedVariants = variants
      .filter(
        (v) =>
          v.sizes.length > 0 && v.colors.length > 0 && Number(v.quantity) > 0,
      )
      .flatMap((v) =>
        v.colors.flatMap((colorId) =>
          v.sizes.map((sizeId) => ({
            colorId,
            sizeId,
            stockQuantity: Number(v.quantity),
          })),
        ),
      );

    const body = {
      name: productName,
      price: Number(price),
      categoryId: category,
      generalTeamId: selectedMemberId,
      description,
      imageUrl: uploadedImageUrl,
      isActive: true,
      variants: mappedVariants,
    };

    try {
      const url = editId
        ? `/api/merch/products/${editId}` // ✅ UPDATE
        : `/api/merch`; // ❌ CREATE

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Request failed");
        return;
      }

      alert(editId ? "Product updated" : "Product created");

      router.push("/team/merch");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // loadProduct useEffect ko is code se replace kar dein

  useEffect(() => {
    // Edit mode tabhi chale jab:
    // 1. editId ho
    // 2. categories load ho chuki hon
    // 3. teamMembers load ho chuke hon
    // 4. colors load ho chuke hon
    // 5. sizes load ho chuke hon
    if (
      !editId ||
      categories.length === 0 ||
      teamMembers.length === 0 ||
      colors.length === 0 ||
      sizesFromAPI.length === 0
    ) {
      return;
    }

    const loadProduct = async () => {
      try {
        setIsEditLoading(true);
        const res = await fetch(`/api/merch/products/${editId}`);
        const json = await res.json();

        if (!json?.data) return;

        const p = json.data;

        // Basic fields
        setProductName(p.name || "");
        setPrice(String(p.price || ""));
        setDescription(p.description || "");
        setUploadedImageUrl(p.imageUrl || "");
        setBannerPreview(p.imageUrl || null);

        // CategoryName -> Category ID
        const matchedCategory = categories.find(
          (c) => c.name === p.categoryName,
        );
        setCategory(matchedCategory?.id || "");

        // GeneralTeamName -> Team Member ID
        const matchedMember = teamMembers.find(
          (t) =>
            t.name === p.generalTeamName || t.displayName === p.generalTeamName,
        );
        setSelectedMemberId(matchedMember?.id || "");

        // Variants mapping
        // API returns:
        // {
        //   colorName: "Black",
        //   sizeValue: "S",
        //   stockQuantity: 2
        // }

        type ApiVariant = {
          colorName: string;
          sizeValue: string;
          stockQuantity: number;
        };

        const mappedVariants =
          Array.isArray(p.variants) && p.variants.length > 0
            ? (p.variants as ApiVariant[]).map((variant) => {
                // ColorName -> Color ID
                const matchedColor = colors.find(
                  (c) => c.name === variant.colorName,
                );

                // SizeValue -> Size ID
                const matchedSize = sizesFromAPI.find(
                  (s) => s.sizeValue === variant.sizeValue,
                );

                return {
                  sizes: matchedSize ? [matchedSize.id] : [],
                  colors: matchedColor ? [matchedColor.id] : [],
                  quantity: String(variant.stockQuantity || ""),
                };
              })
            : [{ sizes: [], colors: [], quantity: "" }];

        setVariants(mappedVariants);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        // Loader stop
        setIsEditLoading(false);
      }
    };

    loadProduct();
  }, [editId, categories, teamMembers, colors, sizesFromAPI]);

  // useEffect(() => {
  //   async function loadMembers() {
  //     debugger;
  //     try {
  //       debugger;
  //       const res = await fetch("/api/team-members");
  //       const json = await res.json();
  //       debugger;
  //       if (json.status && Array.isArray(json.data)) {
  //         setTeamMembers(json.data); // [{id, name}, ...]
  //       }
  //       debugger;
  //     } catch (err) {
  //       console.error("Failed to fetch members", err);
  //     }
  //   }
  //   loadMembers();
  // }, []);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/general-teams/my");
        const json = await res.json();

        console.log("API RESPONSE:", json);

        const teams = json?.data?.data; // ✅ REAL ARRAY HERE

        if (json?.status && Array.isArray(teams)) {
          setTeamMembers(teams);
        } else {
          setTeamMembers([]);
        }
      } catch (err) {
        console.error("Failed to fetch members", err);
        setTeamMembers([]);
      }
    }

    loadMembers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <TeamSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TeamHeader />
        {isEditLoading ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-gray-300 border-t-slate-800 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600 text-sm">Loading product...</p>
            </div>
          </div>
        ) : (
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

                  <div className="mb-6 w-60">
                    <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                      Team Member
                    </Label.Root>
                    <Select.Root
                      value={selectedMemberId}
                      onValueChange={setSelectedMemberId}
                    >
                      <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <Select.Value placeholder="Select team member" />
                        <Select.Icon>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                          <Select.Viewport className="p-1">
                            {teamMembers.map((member) => (
                              <Select.Item
                                key={member.id}
                                value={member.id}
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none rounded"
                              >
                                <Select.ItemText>
                                  {" "}
                                  {member.displayName || member.name}
                                </Select.ItemText>
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

                {/* Variants */}
                <div className="mb-8 space-y-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-5 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                    >
                      Add Variant
                    </button>
                  </div>

                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg space-y-4"
                    >
                      {/* Sizes */}
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                          Available Sizes
                        </Label.Root>
                        <div className="flex flex-wrap gap-2">
                          {sizesFromAPI.map((sizeObj) => (
                            <button
                              key={sizeObj.id}
                              onClick={() =>
                                toggleSizeVariant(index, sizeObj.id)
                              }
                              className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                                variant.sizes.includes(sizeObj.id)
                                  ? "bg-slate-800 text-white border-slate-800"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              {sizeObj.sizeValue}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                          Available Colors
                        </Label.Root>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.id}
                              onClick={() =>
                                toggleColorVariant(index, color.id)
                              }
                              title={color.name}
                              className={`w-10 h-10 rounded-full border-2 transition-all ${
                                variant.colors.includes(color.id)
                                  ? "ring-2 ring-offset-2 ring-slate-800 border-slate-800"
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                              style={{ backgroundColor: color.hexCode }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Quantity
                        </Label.Root>
                        <input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) =>
                            updateQuantity(index, e.target.value)
                          }
                          placeholder="Enter quantity"
                          className="w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </Label.Root>

                  <ImageUploader
                    onUploadSuccess={(finalImageUrl) => {
                      setUploadedImageUrl(finalImageUrl);
                      setBannerPreview(finalImageUrl);
                    }}
                  />

                  {bannerPreview && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={bannerPreview}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => router.push("/team/merch")}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !productName || !price || !category || !uploadedImageUrl
                    }
                    className="px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Product
                  </button>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
