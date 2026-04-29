"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const data = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 198 },
  { name: "Mar", revenue: 5000, orders: 300 },
  { name: "Apr", revenue: 4500, orders: 278 },
  { name: "May", revenue: 6000, orders: 389 },
  { name: "Jun", revenue: 5500, orders: 349 },
  { name: "Jul", revenue: 7000, orders: 430 },
];

export function DashboardChart() {
  const [selectedType, setSelectedType] = useState("Charter");

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Charters
          </h3>
          <Select.Root value={selectedType} onValueChange={setSelectedType}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-1.5 text-sm bg-accent/50 border border-border rounded-lg text-foreground hover:bg-accent focus:outline-none focus:border-primary">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="Charter"
                    className="px-3 py-2 text-sm text-foreground hover:bg-accent rounded cursor-pointer outline-none"
                  >
                    <Select.ItemText>Charter</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="Service"
                    className="px-3 py-2 text-sm text-foreground hover:bg-accent rounded cursor-pointer outline-none"
                  >
                    <Select.ItemText>Service</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="Charter Booking"
                    className="px-3 py-2 text-sm text-foreground hover:bg-accent rounded cursor-pointer outline-none"
                  >
                    <Select.ItemText>Charter Booking</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <select className="px-3 py-1.5 text-sm bg-accent/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary w-full sm:w-auto">
          <option>Last 7 months</option>
          <option>Last 12 months</option>
          <option>This year</option>
        </select>
      </div>
      <div className="h-[220px] sm:h-[280px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0d9488"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
