"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { CharterForm } from "@/app/Components/charter-form";

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdDate: string;
}

export default function CharterPage() {
  // 1️⃣ SWR fetcher for API
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR("/api/CharterServiceItems", fetcher);

  // 2️⃣ API data or empty array
  const charters: Service[] = data?.data || [];

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 3️⃣ Filter table by search
  const filteredCharters = useMemo(() => {
    return charters.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [charters, search]);

  // 4️⃣ Add Service form open
  const handleAddForm = () => {
    if (!isFormOpen) setIsFormOpen(true);
  };

  // 5️⃣ Form submit (POST to API)
  const handleFormSubmit = async (formData: {
    fullName: string;
    description: string;
    amount: number;
    isActive: boolean;
  }) => {
    const payload = {
      name: formData.fullName, // backend expects "name"
      description: formData.description,
      price: formData.amount,
      isActive: formData.isActive,
    };

    const res = await fetch("/api/CharterServiceItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("API failed");
      return;
    }

    // 🔥 VERY IMPORTANT
    await mutate(); // list refresh without page reload
    setIsFormOpen(false);
  };

  // 6️⃣ Edit / Delete (local only, API edit not implemented)
  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({
      serviceName: service.serviceName,
      description: service.description,
      price: service.price,
      isActive: service.isActive,
    });
  };

  const handleSaveEdit = (id: string) => {
    // local update only
    setEditingId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    // local delete only
    // or call API if needed
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Service Charter
              </h1>
              <p className="text-muted-foreground">
                Customize and book your fishing charter experience.
              </p>
            </div>
            <button
              onClick={handleAddForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>

          {/* 7️⃣ Add Service Form */}
          {isFormOpen && (
            <div className="mb-6">
              <CharterForm
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          )}

          {/* 8️⃣ Search & Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
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

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharters.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No services available
                      </td>
                    </tr>
                  ) : (
                    filteredCharters.map((service) => (
                      <tr
                        key={service.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">{service.serviceName}</td>
                        <td className="px-6 py-4">{service.description}</td>
                        <td className="px-6 py-4">${service.price}</td>
                        <td className="px-6 py-4">${service.isActive}</td>
                        <td className="px-6 py-4 text-right">
                          {editingId === service.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSaveEdit(service.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
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
                                    onClick={() => handleEdit(service)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                                  >
                                    <Pencil className="h-4 w-4" /> Edit
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item
                                    onClick={() => handleDelete(service.id)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 text-red-600 outline-none"
                                  >
                                    <Trash2 className="h-4 w-4" /> Delete
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
