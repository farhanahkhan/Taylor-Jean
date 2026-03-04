"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BettingMarketsPage({ bets }: { bets: any[] }) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  const handleSelect = (betId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [betId]: optionId }));
  };

  const handleSettleMarket = (betId: string) => {
    console.log("Settle market for", betId);
    // Your settle logic here
  };

  return (
    <div className="fixed inset-0 bg-[#000000bd] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[70%] max-w-xl p-6 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-slate-500 font-bold"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">All Betting Markets</h2>
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          {bets.map((bet) => (
            <div key={bet.betId}>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {bet.title}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {bet.options.map((opt) => (
                  <div
                    key={opt.optionId}
                    className={`flex flex-col rounded-md p-3 cursor-pointer ${
                      selectedOptions[bet.betId] === opt.optionId
                        ? "bg-primary/20"
                        : "bg-white"
                    }`}
                    onClick={() => handleSelect(bet.betId, opt.optionId)}
                  >
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <p className="text-md font-semibold text-slate-600">
                        {opt.optionName}
                      </p>
                      <p className="text-md font-bold text-primary">
                        {opt.currentOdds}x
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-4 mt-4">
                <button
                  onClick={() => handleSettleMarket(String(bet.betId))}
                  disabled={!selectedOptions[bet.betId]}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 w-[50%] font-medium rounded-lg transition-colors ${
                    selectedOptions[bet.betId]
                      ? "bg-foreground text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  SETTLE MARKET
                </button>
                <button className="inline-flex w-[50%] items-center justify-center gap-2 px-4 py-2.5 text-red-400 font-medium rounded-lg transition-colors border">
                  STOP MARKET
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
