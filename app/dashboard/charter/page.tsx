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
import * as Select from "@radix-ui/react-select";
import {
  getCharters,
  addCharter,
  updateCharter,
  deleteCharter,
  type Charter,
} from "@/lib/charter-store";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import { CharterForm } from "@/app/Components/charter-form";

const charterTypes = [
  "Private Charter",
  "Shared Charter",
  "Tournament Charter",
  "Corporate Charter",
];

export default function CharterPage() {
  const { data: charters = getCharters(), mutate } = useSWR(
    "charters",
    getCharters
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Charter>>({});
  const [openForms, setOpenForms] = useState<number[]>([]);

  const filteredCharters = useMemo(() => {
    return charters.filter(
      (charter) =>
        charter.fullName.toLowerCase().includes(search.toLowerCase()) ||
        charter.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [charters, search]);

  const handleAddForm = () => {
    setOpenForms((prev) => [...prev, Date.now()]);
  };

  const handleRemoveForm = (formId: number) => {
    setOpenForms((prev) => prev.filter((id) => id !== formId));
  };

  const handleFormSubmit = (
    formId: number,
    data: {
      fullName: string;
      email: string;
      charterDate: string;
      charterType: string;
      amount: number;
    }
  ) => {
    addCharter(data);
    handleRemoveForm(formId);
    mutate();
  };

  const handleEdit = (charter: Charter) => {
    setEditingId(charter.id);
    setEditForm({
      fullName: charter.fullName,
      email: charter.email,
      charterDate: charter.charterDate,
      charterType: charter.charterType,
      amount: charter.amount,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateCharter(id, editForm);
    setEditingId(null);
    setEditForm({});
    mutate();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    deleteCharter(id);
    mutate();
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
                Charter Booking
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
              Add Charter
            </button>
          </div>

          {/* Open Forms */}
          {openForms.map((formId) => (
            <div key={formId} className="mb-6">
              <CharterForm
                onSubmit={(data) => handleFormSubmit(formId, data)}
                onCancel={() => handleRemoveForm(formId)}
              />
            </div>
          ))}

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Search and Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search charters by name or email..."
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
                      Full Name
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Email Address
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Charter Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Charter Type
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Amount
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharters.map((charter) => (
                    <tr
                      key={charter.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Full Name Column */}
                      <td className="px-6 py-4">
                        {editingId === charter.id ? (
                          <input
                            type="text"
                            value={editForm.fullName || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="font-semibold text-foreground">
                            {charter.fullName}
                          </p>
                        )}
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-4">
                        {editingId === charter.id ? (
                          <input
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 text-sm text-primary border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="text-sm text-primary">
                            {charter.email}
                          </p>
                        )}
                      </td>

                      {/* Charter Date Column */}
                      <td className="px-6 py-4">
                        {editingId === charter.id ? (
                          <input
                            type="date"
                            value={editForm.charterDate || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                charterDate: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {charter.charterDate}
                          </p>
                        )}
                      </td>

                      {/* Charter Type Column */}
                      <td className="px-6 py-4">
                        {editingId === charter.id ? (
                          <Select.Root
                            value={editForm.charterType}
                            onValueChange={(value) =>
                              setEditForm({ ...editForm, charterType: value })
                            }
                          >
                            <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <Select.Value />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                                <Select.Viewport className="p-1">
                                  {charterTypes.map((type) => (
                                    <Select.Item
                                      key={type}
                                      value={type}
                                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                    >
                                      <Select.ItemText>{type}</Select.ItemText>
                                    </Select.Item>
                                  ))}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        ) : (
                          <span className="text-primary font-medium">
                            {charter.charterType}
                          </span>
                        )}
                      </td>

                      {/* Amount Column */}
                      <td className="px-6 py-4">
                        {editingId === charter.id ? (
                          <input
                            type="number"
                            value={editForm.amount || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: Number(e.target.value),
                              })
                            }
                            className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="font-semibold text-foreground">
                            ${charter.amount.toLocaleString()}
                          </p>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {editingId === charter.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(charter.id)}
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
                                  onClick={() => handleEdit(charter)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => handleDelete(charter.id)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 text-red-600 outline-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCharters.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No charters found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
