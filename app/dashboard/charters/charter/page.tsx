"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { fetchCharters } from "@/lib/charters-store";

import useSWR from "swr";
import {
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Upload,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";

// import { getCharters, addCharters, deleteCharters } from "@/lib/charters-store";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
// import { addCharters, deleteCharters } from "@/lib/charters-store";
type CharterCategory = {
  id: string;
  name: string;
};

type Charter = {
  id: string;
  charterName: string;
  description: string;
  baseAmount: number;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
};

export default function ServicePage() {
  const [charterCategories, setCharterCategories] = useState<
    { id: string; name: string }[]
  >([]);
  // const { data: charters = getCharters(), mutate } = useSWR(
  //   "charters",
  //   getCharters
  // );
  const { data: charters = [], mutate } = useSWR("charters", fetchCharters);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  // const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  // const [charterType, setCharterType] = useState("");
  const [charterCategoryId, setCharterCategoryId] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [amount, setAmount] = useState<string | number>(0);
  const [editId, setEditId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const R2_PUBLIC_BASE_URL =
    "https://pub-a282791a5a174e8daa69fcf36a7fd132.r2.dev";

  const handleEdit = (item: Charter) => {
    if (!item?.id) {
      console.log("NO ID FOUND", item);
      return;
    }

    console.log("EDIT ITEM:", item);

    setShowForm(true);
    setEditId(String(item.id));

    setName(item.charterName);
    setDescription(item.description);
    setAmount(item.baseAmount);
    setCharterCategoryId(item.categoryId);
    setUploadedFileName(item.imageUrl);
    setIsActive(item.isActive);
    setIsFileChanged(false); // 👈 reset
  };
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure?");

    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/charter-services/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Deleted successfully");

      mutate();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/charter-categories");
        const json = await res.json();
        const data = json as { data: CharterCategory[] };

        // setCharterCategories(
        //   (json?.data || []).map((item: any) => ({
        //     id: item.id,
        //     name: item.name,
        //   }))
        // );
        setCharterCategories(
          data.data.map((item) => ({
            id: item.id,
            name: item.name,
          })),
        );
      } catch (err) {
        alert("Failed to load charter categories");
      }
    };

    fetchCategories();
  }, []);

  const filteredCharters = useMemo(() => {
    return charters.filter((charters) =>
      charters.charterName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [charters, search]);

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

      console.log("Uploaded File URL:", finalImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong while uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleSubmit = async () => {
  //   if (!name || !amount || !description || !charterCategoryId) {
  //     alert("Please fill all required fields");
  //     return;
  //   }

  //   try {
  //     setIsSubmitting(true); // 🔄 loader ON
  //     const payload = {
  //       charterName: name, // API field
  //       description: description,
  //       baseAmount: amount,
  //       categoryId: charterCategoryId,
  //       imageUrl: uploadedFileName, // file name only
  //       isActive: isActive,
  //     };
  //     let res; // ✅ yahan declare karo

  //     if (editId) {
  //       res = await fetch(`/api/charter-services/${editId}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });
  //     } else {
  //       res = await fetch("/api/charter-services", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });
  //     }

  //     const data = await res.json();

  //     if (data.status) {
  //       alert("Charter added successfully!");
  //       // Reset form
  //       setName("");
  //       setAmount(0);
  //       setDescription("");
  //       setCharterCategoryId("");
  //       setUploadedFileName("");
  //       setIsActive(true);
  //       setShowForm(false);

  //       mutate();
  //     } else {
  //       alert("Failed to add charter: " + data.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong!");
  //   }
  // };

  const handleSubmit = async () => {
    // debugger;
    console.log("EDIT ID BEFORE API:", editId);
    if (!name || !amount || !description || !charterCategoryId) {
      alert("Please fill all required fields");
      return;
    }
    // debugger;
    console.log("EDIT ID BEFORE API:", editId);

    try {
      setIsSubmitting(true);

      const payload = {
        charterName: name,
        description,
        baseAmount: Number(amount),
        categoryId: charterCategoryId,
        imageUrl: uploadedFileName,
        isActive,
      };
      // debugger;

      let res;

      if (editId) {
        // UPDATE
        res = await fetch(`/api/charter-services/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch(`/api/charter-services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      if (res.status === 200 && data?.status === true) {
        alert(editId ? "Updated successfully!" : "Created successfully!");

        setName("");
        setAmount(0);
        setDescription("");
        setCharterCategoryId("");
        setUploadedFileName("");
        setIsActive(true);
        setShowForm(false);
        setEditId(null);

        mutate();
        // debugger;
      } else {
        alert(data.message || "Request failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
    // debugger;
  };
  // const handleDelete = (id: string) => {
  //   // deleteCharters(id);
  //   mutate();
  // };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Charter</h1>
              <p className="text-muted-foreground">
                Manage your charter service packages and pricing.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Charter
            </button>
          </div>

          {/* Service Creation Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              {/* Name and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAmount(val === "" ? "" : Number(val));
                    }}
                    // onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Charter Category
                  </label>
                  <Select.Root
                    value={charterCategoryId}
                    onValueChange={setCharterCategoryId}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg">
                      <Select.Value placeholder="Select Charter Category" />
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border z-50">
                        <Select.Viewport className="p-1">
                          {charterCategories.map((cat) => (
                            <Select.Item
                              key={cat.id}
                              value={cat.id} // ✅ ID save hogi
                              className="px-8 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            >
                              <Select.ItemText>
                                {cat.name} {/* ✅ Name show hoga */}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
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

              {/* Is Active */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                    style={{
                      accentColor: "oklch(0.78 0.16 85)",
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    Is Active
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                {/* <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Submit
                </button> */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-slate-800 hover:bg-slate-700"
    }
  `}
                >
                  {isSubmitting && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {/* Services List Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Search and Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 h-10 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Name
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Description
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Charter Type
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      File Name
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharters.map((charters) => (
                    <tr
                      key={charters.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          {charters.charterName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {charters.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {charters.categoryId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          ${charters.baseAmount}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {charters.imageUrl || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                            charters.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {charters.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              className="min-w-[140px] bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                            >
                              <DropdownMenu.Item
                                onClick={() => handleEdit(charters)}
                                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                // onClick={() => {
                                //   console.log("EDIT CLICKED", charters);
                                //   handleEdit(charters);
                                // }}
                                onClick={() => handleDelete(charters.id)}
                                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 text-red-600 outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
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

              {filteredCharters.length === 0 && (
                <>
                  {/* <div className="text-center py-12 text-muted-foreground">
                    No services found
                  </div> */}
                  <div className="col-span-full flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-gray-700">
                      Loading Charter List
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
