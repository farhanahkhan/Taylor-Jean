"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdDate: string;
}

export default function ServicePage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR("/api/CharterServiceItems", fetcher);

  const services: Service[] = data?.data || [];

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);

  // filter
  const filtered = useMemo(() => {
    return services.filter((s) =>
      s.serviceName.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  // EDIT
  // const handleEdit = (item: Service) => {
  //   setEditId(item.id);
  //   setShowForm(true);

  //   setName(item.serviceName);
  //   setDescription(item.description);
  //   setAmount(item.price);
  //   setIsActive(item.isActive);
  // };

  const handleEdit = (item: Service) => {
    if (!item?.id) {
      alert("Invalid item id");
      return;
    }

    setEditId(item.id);
    setName(item.serviceName);
    setDescription(item.description);
    setAmount(item.price);
    setIsActive(item.isActive);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure?");
    if (!ok) return;

    await fetch(`/api/CharterServiceItems/${id}`, {
      method: "DELETE",
    });

    mutate();
  };

  // SUBMIT (CREATE / UPDATE)
  const handleSubmit = async () => {
    if (editId === null && showForm && !editId) {
      console.log("CREATE MODE");
    }

    if (editId) {
      console.log("UPDATE MODE ID:", editId);
    }
    debugger;
    if (!name || !amount || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        Name: name,
        description,
        amount: Number(amount),
        isActive,
      };
      //   const payload = {
      //   Name: name,
      //   Description: description,
      //   BaseAmount: Number(amount),
      //   IsActive: isActive,
      // };

      let res;
      debugger;

      if (editId) {
        res = await fetch(`/api/CharterServiceItems/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        debugger;
      } else {
        res = await fetch(`/api/CharterServiceItems`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      debugger;

      const data = await res.json();
      debugger;
      if (!res.ok) {
        alert(data?.message || "Error");
        return;
      }

      // reset
      setName("");
      setDescription("");
      setAmount("");
      setIsActive(true);
      setEditId(null);
      setShowForm(false);

      mutate();
    } finally {
      setIsSubmitting(false);
    }
    debugger;
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Service Charter</h1>
              <p className="text-gray-500">Manage services</p>
            </div>

            <button
              onClick={() => {
                setEditId(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {/* FORM (same page like charter) */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Is Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {/* SEARCH */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  placeholder="Search services..."
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 text-xs uppercase">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase">
                      Description
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase">
                      Price
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isSubmitting ? (
                    <tr>
                      <td colSpan={4} className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-300 border-t-slate-800 rounded-full animate-spin"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Loading data...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">
                          {item.serviceName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.description}
                        </td>
                        <td className="px-6 py-4">${item.price}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content className="bg-white border rounded-lg shadow-lg p-1">
                              <DropdownMenu.Item
                                onClick={() => handleEdit(item)}
                                className="px-3 py-2 flex gap-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                                Edit
                              </DropdownMenu.Item>

                              <DropdownMenu.Item
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-2 flex gap-2 hover:bg-red-50 text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filtered.length === 0 && (
                // <div className="text-center py-12 text-muted-foreground">
                //   No service inquiries found
                // </div>
                <div className="col-span-full flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-gray-700">
                    Loading Service Charter
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
