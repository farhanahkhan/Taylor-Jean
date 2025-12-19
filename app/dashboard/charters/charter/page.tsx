"use client";

import { useState } from "react";
// import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Bell, User } from "lucide-react";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { Header } from "@/app/Components/header";
import { DashboardHeader } from "@/app/Components/dashboard-header";

const services = [
  { id: 1, name: "Fishing Guide", amount: 150 },
  { id: 2, name: "Boat Fuel", amount: 200 },
  { id: 3, name: "Equipment Rental", amount: 100 },
  { id: 4, name: "Food & Drinks", amount: 75 },
];

export default function ServicesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleService = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const total = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Submit logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        {/* Content */}
        <main className="p-6 flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 lg:w-[55%] w-[95%]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={total}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Select Services</h2>

                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-primary"
                          checked={selected.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                        />
                        <span className="text-sm font-medium">
                          {service.name}
                        </span>
                      </div>
                      <span className="font-semibold text-sm">
                        ${service.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-4 border-t">
                <span className="text-base font-semibold">Total</span>
                <span className="text-lg font-bold">${total}</span>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-md font-medium text-foreground">
                  Is Active
                </span>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
