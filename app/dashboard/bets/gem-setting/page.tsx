"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { apiFetch } from "@/lib/apiFetch";

interface GemSetting {
  id: string;
  coinRatePerGem: number;

  minimumPurchaseQuantity: number;
  maximumPurchaseQuantity: number;
  isActive: boolean;
}

interface GemSettingForm {
  coinRatePerGem: string;

  minimumPurchaseQuantity: string;
  maximumPurchaseQuantity: string;
  isActive: boolean;
}

const initialForm: GemSettingForm = {
  coinRatePerGem: "",

  minimumPurchaseQuantity: "",
  maximumPurchaseQuantity: "",
  isActive: true,
};

export default function GemSettingPage() {
  const [gemSettings, setGemSettings] = useState<GemSetting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<GemSettingForm>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizeBool = (value: unknown) =>
    value === true || value === "true" || value === 1 || value === "1";

  const resetForm = () => {
    setEditId(null);
    setFormData(initialForm);
  };

  const fetchGemSettings = async () => {
    setLoading(true);

    try {
      const res = await apiFetch("/api/gem-setting");

      if (!res.ok) {
        throw new Error("Failed to fetch gem settings");
      }

      const json = await res.json();

      setGemSettings(
        (json.data || []).map((item: GemSetting) => ({
          ...item,
          isActive: normalizeBool(item.isActive),
        })),
      );
    } catch (error) {
      console.error("Gem Setting fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGemSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const minimumQuantity = Number(formData.minimumPurchaseQuantity);

    const maximumQuantity = Number(formData.maximumPurchaseQuantity);

    if (maximumQuantity < minimumQuantity) {
      alert(
        "Maximum Purchase Quantity cannot be less than Minimum Purchase Quantity.",
      );
      return;
    }

    const payload = {
      coinRatePerGem: Number(formData.coinRatePerGem),

      minimumPurchaseQuantity: minimumQuantity,
      maximumPurchaseQuantity: maximumQuantity,
      isActive: formData.isActive,
    };

    setLoading(true);

    try {
      const res = await apiFetch(
        editId ? `/api/gem-setting/${editId}` : "/api/gem-setting",
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Something went wrong");
        return;
      }

      alert(
        editId
          ? "Gem Setting updated successfully!"
          : "Gem Setting created successfully!",
      );

      resetForm();
      await fetchGemSettings();
    } catch (error) {
      console.error("Gem Setting submit error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GemSetting) => {
    setEditId(item.id);

    setFormData({
      coinRatePerGem: String(item.coinRatePerGem ?? ""),

      minimumPurchaseQuantity: String(item.minimumPurchaseQuantity ?? ""),
      maximumPurchaseQuantity: String(item.maximumPurchaseQuantity ?? ""),
      isActive: normalizeBool(item.isActive),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Gem Setting?")) {
      return;
    }

    try {
      const res = await apiFetch(`/api/gem-setting/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Delete failed");
        return;
      }

      alert("Gem Setting deleted successfully!");

      await fetchGemSettings();
    } catch (error) {
      console.error("Gem Setting delete error:", error);
      alert("Something went wrong");
    }
  };

  const filteredGemSettings = gemSettings.filter((item) =>
    String(item.coinRatePerGem).includes(searchQuery),
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
                  Gem Setting
                </h1>

                <p className="text-sm md:text-base text-slate-600 mt-1">
                  Create and manage gem purchase settings.
                </p>
              </div>

              <Button
                type="button"
                onClick={resetForm}
                className="bg-slate-800 hover:bg-slate-700 text-white self-start sm:self-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Gem Setting
              </Button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  {editId ? "Edit Gem Setting" : "Gem Setting"}
                </h2>

                <p className="text-sm text-slate-600 mt-1">
                  Enter gem purchase setting details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    BASIC INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Purchase Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Coin Rate Per Gem
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <input
                        type="number"
                        value={formData.coinRatePerGem}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coinRatePerGem: e.target.value,
                          })
                        }
                        placeholder="Enter Coin Rate Per Gem"
                        min="0"
                        step="any"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Minimum Purchase Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Minimum Purchase Quantity
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <input
                        type="number"
                        value={formData.minimumPurchaseQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minimumPurchaseQuantity: e.target.value,
                          })
                        }
                        placeholder="Enter minimum quantity"
                        min="1"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Maximum Purchase Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Maximum Purchase Quantity
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <input
                        type="number"
                        value={formData.maximumPurchaseQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maximumPurchaseQuantity: e.target.value,
                          })
                        }
                        placeholder="Enter maximum quantity"
                        min="1"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Status */}
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
                    onClick={resetForm}
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

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gem setting..."
                    className="w-74 pl-10 pr-4 h-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <Button
                  type="button"
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
                          Coin Rate Per Gem
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Min Quantity
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Max Quantity
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="flex flex-col justify-center items-center h-48 gap-3">
                              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

                              <span className="text-sm text-slate-500">
                                Loading Gem Settings...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredGemSettings.map((item) => (
                          <tr key={item.id} className="hover:bg-primary/10">
                            <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                              {item.coinRatePerGem}
                            </td>

                            <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                              {item.minimumPurchaseQuantity}
                            </td>

                            <td className="px-3 py-4 text-sm text-slate-900 whitespace-nowrap">
                              {item.maximumPurchaseQuantity}
                            </td>

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

                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                  <button
                                    type="button"
                                    className="p-1 hover:bg-slate-100 rounded"
                                  >
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

                  {!loading && filteredGemSettings.length === 0 && (
                    <div className="flex justify-center items-center h-40 text-sm text-slate-500">
                      No Gem Settings found.
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
