"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { Check, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

const targetSpecies = [
  "Sea Bass",
  "Striped Bass",
  "White Marlin",
  "Blue Marlin",
  "Tuna",
  "Mahi",
  "Shark",
];

const tripLengths = [
  "Half Day (4 hours)",
  "3/4 Day (6 hours)",
  "Full Day (8 hours)",
  "Extended Day (10 hours)",
  "Overnight Trip",
];

const charterTypes = [
  "Private Charter",
  "Shared Charter",
  "Tournament Charter",
  "Corporate Charter",
];

export default function CharterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    charterDate: "",
    backupDate: "",
    charterType: "",
    emergencyName: "",
    emergencyContact: "",
    targetSpecies: [] as string[],
    tripLength: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpeciesToggle = (species: string) => {
    setFormData((prev) => ({
      ...prev,
      targetSpecies: prev.targetSpecies.includes(species)
        ? prev.targetSpecies.filter((s) => s !== species)
        : [...prev.targetSpecies, species],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Charter booking submitted:", formData);
    alert("Charter booking submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="bg-gray-50 flex flex-col items-center">
          <div className="flex-1  p-4 md:p-6 lg:p-8 lg:w-[60%]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Charter Booking
              </h1>
              <p className="text-gray-500 mt-1">
                Customize and book your fishing charter experience.
              </p>
            </div>
            {/* max-w-4xl */}
            {/* Form Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm max-w-4xl ">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Charter</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details to book your fishing trip.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name *
                        </Label.Root>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address *
                        </Label.Root>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number *
                        </Label.Root>
                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charter Details */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Charter Details
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Charter Date
                        </Label.Root>
                        <input
                          type="date"
                          name="charterDate"
                          value={formData.charterDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Backup Charter Date
                        </Label.Root>
                        <input
                          type="date"
                          name="backupDate"
                          value={formData.backupDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                          Charter Type
                        </Label.Root>
                        <Select.Root
                          value={formData.charterType}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              charterType: value,
                            }))
                          }
                        >
                          <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <Select.Value placeholder="Select an option" />
                            <Select.Icon>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                              <Select.Viewport className="p-1">
                                {charterTypes.map((type) => (
                                  <Select.Item
                                    key={type}
                                    value={type}
                                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none rounded"
                                  >
                                    <Select.ItemText>{type}</Select.ItemText>
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
                        Length of Trip
                      </Label.Root>
                      <Select.Root
                        value={formData.tripLength}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            tripLength: value,
                          }))
                        }
                      >
                        <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <Select.Value placeholder="Select trip length" />
                          <Select.Icon>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                            <Select.Viewport className="p-1">
                              {tripLengths.map((length) => (
                                <Select.Item
                                  key={length}
                                  value={length}
                                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none rounded"
                                >
                                  <Select.ItemText>{length}</Select.ItemText>
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
                </div>

                {/* Emergency Contact */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Emergency Contact
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emergency Name (Optional)
                      </Label.Root>
                      <input
                        type="text"
                        name="emergencyName"
                        value={formData.emergencyName}
                        onChange={handleInputChange}
                        placeholder="Enter emergency contact name"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label.Root className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emergency Contact Number (Optional)
                      </Label.Root>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="Enter emergency phone number"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Species */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Target Species
                  </h3>

                  <div>
                    <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                      Select all that apply
                    </Label.Root>
                    <div className="flex flex-wrap gap-2">
                      {targetSpecies.map((species) => (
                        <button
                          key={species}
                          type="button"
                          onClick={() => handleSpeciesToggle(species)}
                          className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                            formData.targetSpecies.includes(species)
                              ? "bg-primary/10"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 cursor-pointer"
                          }`}
                        >
                          {species}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Submit Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
