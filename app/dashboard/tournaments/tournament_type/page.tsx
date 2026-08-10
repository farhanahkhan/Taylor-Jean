"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { apiFetch } from "@/lib/apiFetch";

interface TournamentType {
  id: string;
  name: string;
  isActive: boolean;
}

interface FormData {
  name: string;
  isActive: boolean;
}

export default function TournamentTypePage() {
  const [tournamentTypes, setTournamentTypes] = useState<TournamentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const normalizeBool = (val: unknown): boolean => {
    return val === true || val === "true" || val === 1 || val === "1";
  };

  const fetchTournamentTypes = async () => {
    setLoading(true);

    try {
      const res = await apiFetch("/api/tournament-type");

      if (!res.ok) {
        throw new Error("Failed to fetch tournament types");
      }

      const json = await res.json();

      setTournamentTypes(
        (json.data || []).map((item: TournamentType) => ({
          ...item,
          isActive: normalizeBool(item.isActive),
        })),
      );
    } catch (error) {
      console.error("Tournament Type fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        isActive: formData.isActive,
      };

      let res;

      if (editId) {
        res = await apiFetch(`/api/tournament-type/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await apiFetch("/api/tournament-type", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Something went wrong");
        return;
      }

      alert(
        editId
          ? "Tournament Type updated successfully!"
          : "Tournament Type created successfully!",
      );

      await fetchTournamentTypes();

      setEditId(null);

      setFormData({
        name: "",
        isActive: true,
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TournamentType) => {
    setEditId(item.id);

    setFormData({
      name: item.name,
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this Tournament Type?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/tournament-type/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Delete failed");
        return;
      }

      alert("Tournament Type deleted successfully!");

      await fetchTournamentTypes();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleCancel = () => {
    setEditId(null);

    setFormData({
      name: "",
      isActive: true,
    });
  };

  const filteredTournamentTypes = tournamentTypes.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-8xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Tournament Type
                </h1>

                <p className="text-sm md:text-base text-slate-600 mt-1">
                  Create and manage tournament types.
                </p>
              </div>

              <Button className="bg-slate-800 hover:bg-slate-700 text-white self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Tournament Type
              </Button>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  {editId ? "Edit Tournament Type" : "Tournament Type"}
                </h2>

                <p className="text-sm text-slate-600 mt-1">
                  Enter tournament type details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    BASIC INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter tournament type name"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Active */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                      </label>

                      <div className="h-[42px] flex items-center">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isActive: e.target.checked,
                              })
                            }
                            className="h-5 w-5 accent-primary cursor-pointer"
                          />

                          <span className="text-sm text-gray-700">
                            Is Active
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-700"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    {loading ? "Saving..." : editId ? "Update" : "Submit"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tournament type..."
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

              {/* Table */}
              <div className="overflow-x-auto -mx-4 md:-mx-6">
                <div className="inline-block min-w-full align-middle px-4 md:px-6">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={3}>
                            <div className="flex flex-col justify-center items-center h-48 gap-3">
                              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>

                              <span className="text-sm text-slate-500">
                                Loading Tournament Types...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTournamentTypes.map((item) => (
                          <tr key={item.id} className="hover:bg-primary/10">
                            {/* Name */}
                            <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                              {item.name}
                            </td>

                            {/* Status */}
                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                  item.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {item.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                            {/* Actions */}
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
                                      onClick={() => handleEdit(item)}
                                      className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded cursor-pointer outline-none"
                                    >
                                      Edit
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                      onClick={() => handleDelete(item.id)}
                                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none"
                                    >
                                      Delete
                                    </DropdownMenu.Item>
                                  </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                              </DropdownMenu.Root>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {!loading && filteredTournamentTypes.length === 0 && (
                    <div className="flex justify-center items-center h-40 text-sm text-slate-500">
                      No Tournament Types found.
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
