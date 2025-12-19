"use client";

import type React from "react";
import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { Check, ChevronDown } from "lucide-react";

const charterTypes = [
  "Private Charter",
  "Shared Charter",
  "Tournament Charter",
  "Corporate Charter",
];
const tripLengths = [
  "Half Day (4 hours)",
  "3/4 Day (6 hours)",
  "Full Day (8 hours)",
  "Overnight",
];

const charterPrices: Record<string, number> = {
  "Private Charter": 1500,
  "Shared Charter": 800,
  "Tournament Charter": 2500,
  "Corporate Charter": 3500,
};

interface CharterBookingFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    charterDate: string;
    charterType: string;
    amount: number;
  }) => void;
  onCancel: () => void;
}

export function CharterBookingForm({
  onSubmit,
  onCancel,
}: CharterBookingFormProps) {
  const [newSpecies, setNewSpecies] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    charterDate: "",
    backupCharterDate: "",
    charterType: "",
    emergencyName: "",
    emergencyContact: "",
    tripLength: "",
    amount: "",
  });

  const [targetSpecies, setTargetSpecies] = useState<string[]>([
    "Sea Bass",
    "Striped Bass",
    "White Marlin",
    "Blue Marlin",
    "Tuna",
    "Mahi",
    "Shark",
  ]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSpecies = () => {
    if (!newSpecies.trim()) return;

    // prevent duplicates
    if (targetSpecies.includes(newSpecies.trim())) {
      setNewSpecies("");
      return;
    }

    setTargetSpecies((prev) => [...prev, newSpecies.trim()]);
    setNewSpecies("");
  };

  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = formData.amount
      ? Number.parseFloat(formData.amount)
      : charterPrices[formData.charterType] || 0;

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      contact: formData.phoneNumber,
      emergencyName: formData.emergencyName,
      emergencyContact: formData.emergencyContact,
      preferredDate: formData.charterDate,
      backUpDate: formData.backupCharterDate,
      charterType: formData.charterType,
      amount,
    };

    try {
      const res = await fetch("/api/charter-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      // ✅ Success
      alert("Booking successful!");
      onSubmit({
        fullName: payload.fullName,
        email: payload.email,
        charterDate: payload.preferredDate, // API me preferredDate, form me charterDate
        charterType: payload.charterType,
        amount: payload.amount,
      });
    } catch (err: any) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Charter</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details to book your fishing trip.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label.Root className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Basic Information
          </Label.Root>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
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

        <div>
          <Label.Root className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Charter Details
          </Label.Root>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Charter Date
              </label>
              <input
                type="date"
                name="charterDate"
                required
                value={formData.charterDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Backup Charter Date
              </label>
              <input
                type="date"
                name="backupCharterDate"
                value={formData.backupCharterDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Charter Type
              </label>
              <Select.Root
                value={formData.charterType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, charterType: value }))
                }
              >
                <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <Select.Value placeholder="Select an option" />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Length of Trip
            </label>
            <Select.Root
              value={formData.tripLength}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, tripLength: value }))
              }
            >
              <Select.Trigger className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <Select.Value placeholder="Select trip length" />
                <Select.Icon>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
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

        <div>
          <Label.Root className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Emergency Contact
          </Label.Root>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Emergency Name (Optional)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Emergency Contact Number (Optional)
              </label>
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

        <div>
          <Label.Root className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Target Species
          </Label.Root>
          <p className="text-sm text-gray-600 mb-3">Select all that apply</p>

          <div className="flex items-center gap-2 my-4">
            <input
              type="text"
              value={newSpecies}
              onChange={(e) => setNewSpecies(e.target.value)}
              placeholder="Add custom species"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="button"
              onClick={addSpecies}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {targetSpecies.map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => toggleSpecies(species)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedSpecies.includes(species)
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {species}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter Amount"
            className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !formData.fullName ||
              !formData.email ||
              !formData.phoneNumber ||
              !formData.charterDate ||
              !formData.charterType
            }
            className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
}
