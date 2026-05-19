"use client";

import type React from "react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Search, Filter, Plus, MoreVertical, Upload } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { mutate } from "swr";

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
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const R2_PUBLIC_BASE_URL =
    "https://pub-a282791a5a174e8daa69fcf36a7fd132.r2.dev";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileChanged(true); // 👈 NEW
    setIsUploading(true); // 👈 upload start

    try {
      // File name ko safe banao
      const safeFileName = encodeURIComponent(file.name.replace(/\s/g, "_"));

      const contentType = file.type;

      // 1. Presigned URL generate karo
      const res = await fetch(
        `/api/uploads/generate-upload-url?fileName=${safeFileName}&contentType=${encodeURIComponent(
          contentType,
        )}`,
      );

      const data = await res.json();

      if (!res.ok || !data?.uploadUrl) {
        alert(data?.message || "Failed to generate upload URL");
        return;
      }

      // 2. File ko Cloudflare R2 par upload karo
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadRes.ok) {
        alert("Upload failed");
        return;
      }

      // 3. Full public URL banao
      // Example:
      // https://pub-a282791a5a174e8daa69fcf36a7fd132.r2.dev/my-image.jpg
      const finalImageUrl = `${R2_PUBLIC_BASE_URL}/${safeFileName}`;

      // 4. State mein full URL save karo
      setUploadedFileName(finalImageUrl);

      setFormData((prev) => ({
        ...prev,
        imageUrl: finalImageUrl,
      }));

      console.log("Uploaded File URL:", finalImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong while uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const normalizeBool = (val: unknown): boolean => {
    return val === true || val === "true" || val === 1 || val === "1";
  };
  const handleEdit = (cat: Category) => {
    setEditId(cat.id);

    setFormData({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl || "",
      isSuccess: normalizeBool(cat.isActive),
    });
  };
  // Function must be inside component
  // const fetchCategories = async (): Promise<void> => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/charter-categories");
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     const json = await res.json();
  //     setCategories(json.data);
  //   } catch (err) {
  //     console.error("Error fetching categories:", err);
  //   }
  // };
  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/charter-categories");
      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();

      setCategories(
        json.data.map((item: Category) => ({
          ...item,
          isActive: normalizeBool(item.isActive),
        })),
      );
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   setSuccess(false);

  //   try {
  //     const res = await fetch("/api/charter-categories", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         description: formData.description,
  //         imageUrl: formData.imageUrl,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Failed to create category");

  //     // const data: CategoryResponse = await res.json(); // optional

  //     // Reset form
  //     setFormData({
  //       name: "",
  //       description: "",
  //       imageUrl: "",
  //       isSuccess: false,
  //     });
  //     setSuccess(true);

  //     // ✅ Refresh table
  //     await fetchCategories();
  //   } catch (err: unknown) {
  //     if (err instanceof Error) setError(err.message);
  //     else setError("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        isActive: formData.isSuccess,
      };

      let res;

      if (editId) {
        res = await fetch(`/api/charter-categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/charter-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed");
        return;
      }

      alert(editId ? "Updated successfully!" : "Created successfully!");

      await fetchCategories();

      setEditId(null);

      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isSuccess: false,
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/charter-categories/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        // Error message from API
        alert(result?.data?.message || result?.message || "Delete failed");
        return;
      }

      // ✅ API response:
      // {
      //   message: "Success",
      //   status: true,
      //   statusCode: 200,
      //   data: {
      //     message: "Record successfully deleted"
      //   }
      // }

      // ✅ Show exact message from API
      alert(result?.data?.message || "Record successfully deleted");

      // ✅ Refresh categories list
      await fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  // const handleDelete = async (id: string) => {
  //   const confirmDelete = confirm("Are you sure?");

  //   if (!confirmDelete) return;
  //   try {
  //     const res = await fetch(`/api/charter-categories/${id}`, {
  //       method: "DELETE",
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Delete failed");
  //       return;
  //     }

  //     alert("Deleted successfully");

  //     // mutate();
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong");
  //   }
  // };
  const filteredCategories = categories.filter(
    (cat) =>
      (cat.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Upload Image
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />

                          <label
                            htmlFor="file-upload"
                            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer
                       ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-slate-800 hover:bg-slate-700"}
                     `}
                          >
                            {isUploading ? (
                              <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Upload
                              </>
                            )}
                          </label>

                          {uploadedFileName && !isUploading && (
                            <span className="text-sm text-muted-foreground">
                              <span>{uploadedFileName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isSuccess}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSuccess: e.target.checked,
                      })
                    }
                    className="h-5 w-6 accent-primary"
                  />
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
                    <tbody className="">
                      {filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-primary/10">
                          <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                            <p className="text-sm text-muted-foreground">
                              {category.name}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-sm text-slate-600 whitespace-nowrap">
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-slate-900 whitespace-nowrap">
                            {category.imageUrl}
                          </td> */}
                          <td className="px-3 py-4 w-[30%]">
                            <p className="text-sm text-muted-foreground">
                              {category.imageUrl}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                category.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 hover:bg-gray-700"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
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
                                  <DropdownMenu.Item
                                    onClick={() => handleEdit(category)}
                                    className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded cursor-pointer outline-none"
                                  >
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
