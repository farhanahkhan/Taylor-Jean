"use client";

import type React from "react";
import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { Check, ChevronDown } from "lucide-react";

// const charterPrices: Record<string, number> = {
//   "Private Charter": 1500,
//   "Shared Charter": 800,
//   "Tournament Charter": 2500,
//   "Corporate Charter": 3500,
// };

interface Props {
  onSubmit: (data: {
    fullName: string;
    description: string;
    amount: number;
    isActive: boolean;
  }) => void;
  onCancel: () => void;
}

export function ServiceForm({ onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    amount: "",
    isActive: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onSubmit({
      fullName: formData.fullName,
      description: formData.description,
      amount: amountNum,
      isActive: formData.isActive,
    });
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
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter Description"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="Enter Amount"
                className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">Is Active</label>
          </div>
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
            // disabled={
            //   submitting ||
            //   !formData.fullName ||
            //   !formData.description ||
            //   !formData.amount
            // }
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
