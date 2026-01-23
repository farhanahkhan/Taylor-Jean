"use client";

import type React from "react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Search, Filter, Plus, MoreVertical, Upload } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  imageUrl: string | null;
}

interface FormData {
  name: string;
  description: string;
  imageUrl: string;
  isSuccess: boolean;
}
interface CategoryResponse {
  name: string;
  description: string;
  imageUrl: string;
}
export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    imageUrl: "",
    isSuccess: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageUrl: file.name });
    }
  };
  // Function must be inside component
  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/charter-categories"); // yeh aapki API route
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setCategories(json.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ useEffect calls the function
  useEffect(() => {
    fetchCategories();
  }, []);

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError("");
  //     setSuccess(false);

  //     try {
  //       const res = await fetch("/api/charter-categories", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           name: formData.name,
  //           description: formData.description,
  //           imageUrl: formData.imageUrl,
  //         }),
  //       });

  //       if (!res.ok) throw new Error("Failed to create category");

  //       const data: CategoryResponse = await res.json(); // ✅ type cast

  //       const newCategory: Category = {
  //         id: (categories.length + 1).toString(),
  //         name: data.name,
  //         description: data.description,
  //         imageUrl: data.imageUrl,
  //         isActive: formData.isSuccess,
  //       };

  //       setCategories([...categories, newCategory]);
  //       setFormData({
  //         name: "",
  //         description: "",
  //         imageUrl: "",
  //         isSuccess: false,
  //       });
  //       setSuccess(true);
  //     } catch (err: unknown) {
  //       // ✅ unknown instead of any
  //       if (err instanceof Error) setError(err.message);
  //       else setError("Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/charter-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      // const data: CategoryResponse = await res.json(); // optional

      // Reset form
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isSuccess: false,
      });
      setSuccess(true);

      // ✅ Refresh table
      await fetchCategories();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-8xl  space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Category
                </h1>
                <p className="text-sm md:text-base text-slate-600 mt-1">
                  Customize and book your fishing charter experience.
                </p>
              </div>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Category
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in the details to book your fishing trip.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    BASIC INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter Description"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="lg:col-span-1">
                      <label
                        htmlFor="image"
                        className="text-sm font-medium text-slate-700"
                      >
                        Image
                      </label>
                      <div className="mt-1 flex items-center gap-3">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                          className="bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        {formData.imageUrl && (
                          <span className="text-sm text-slate-600 truncate">
                            {formData.imageUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="h-5 w-6 accent-primary" />
                  <label className="text-sm text-gray-700">Is Active</label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        name: "",
                        description: "",
                        imageUrl: "",
                        isSuccess: false,
                      })
                    }
                    className="border-slate-300 text-slate-700 hover:bg-slate-50  hover:text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>

            {/* Search and Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-74 pl-10 pr-4 h-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-700 self-start sm:self-auto bg-transparent"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="overflow-x-auto -mx-4 md:-mx-6">
                <div className="inline-block min-w-full align-middle px-4 md:px-6">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          NAME
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          DESCRIPTION
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-primary/10">
                          <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                            {category.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-slate-600 whitespace-nowrap">
                            {category.description}
                          </td>
                          <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                            {category.imageUrl}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              Active
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="p-1 hover:bg-slate-100 rounded">
                                  <MoreVertical className="h-5 w-5 text-slate-600" />
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                  className="min-w-[160px] bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-50"
                                  sideOffset={5}
                                >
                                  <DropdownMenu.Item className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded cursor-pointer outline-none">
                                    Edit
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none"
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    Delete
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCategories.length === 0 && (
                    // <div className="text-center py-12 text-muted-foreground">
                    //   No service inquiries found
                    // </div>
                    <div className="col-span-full flex justify-center items-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                      <span className="ml-2 text-gray-700">
                        Loading Category
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
