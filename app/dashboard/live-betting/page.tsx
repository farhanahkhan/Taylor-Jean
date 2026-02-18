"use client";

import { DashboardHeader } from "@/app/Components/dashboard-header";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ArrowLeft, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BettingMarket {
  id: string;
  title: string;
  activeTeams: number;
  prizePool: number;
  markets: number;
  volume: number;
  tournament: string;
  location: string;
  options: MarketOption[];
}

interface BettingOption {
  id: string;
  option: string;
  odds: number;
}

interface SubmissionFeedItem {
  id: string;
  captain: string;
  species: string;
  weight: string;
  image: string;
  status: "pending" | "verified";
}

const mockBettingMarkets: BettingMarket[] = [
  {
    id: 1,
    title: "Everglades Challenge",
    activeTeams: 42,
    prizePool: 25000,
    markets: 1,
    volume: 8400,
    tournament: "Everglades Challenge",
    location: "Control Dashboard • Florida Keys",
  },
];

const mockSubmissions: SubmissionFeedItem[] = [
  {
    id: "1",
    captain: "Capt. Dave",
    species: "Mahi Mahi",
    weight: "42 lbs • 48 in",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    status: "pending",
  },
  {
    id: "2",
    captain: "Capt. Sarah",
    species: "Snook",
    weight: "12 lbs • 32 in",
    image: "/underwater-coral-reef-deep-sea-fishing.jpg",
    status: "pending",
  },
  {
    id: "3",
    captain: "Team Reel",
    species: "Tarpon",
    weight: "112 lbs • 74 in",
    image: "/sunset-beach-silhouette-fishing-tournament.jpg",
    status: "pending",
  },
  {
    id: "4",
    captain: "Capt. Mike",
    species: "Redfish",
    weight: "18 lbs • 34 in",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    status: "verified",
  },
  {
    id: "5",
    captain: "Capt. Mike",
    species: "Redfish",
    weight: "18 lbs • 34 in",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    status: "verified",
  },
  {
    id: "6",
    captain: "Capt. Mike",
    species: "Redfish",
    weight: "18 lbs • 34 in",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    status: "verified",
  },
  {
    id: "7",
    captain: "Capt. Mike",
    species: "Redfish",
    weight: "18 lbs • 34 in",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    status: "verified",
  },
];

interface MarketOption {
  option: string;
  odds: number;
}

export default function LiveBettingPage() {
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [marketTitle, setMarketTitle] = useState("");
  const [marketRules, setMarketRules] = useState("");
  const [marketOpens, setMarketOpens] = useState("");
  const [marketCloses, setMarketCloses] = useState("");
  const [options, setOptions] = useState<MarketOption[]>([
    { option: "", odds: 1 },
  ]);

  const addOption = () => {
    setOptions([...options, { option: "", odds: 1 }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    index: number,
    field: "option" | "odds",
    value: string
  ) => {
    const newOptions = [...options];
    if (field === "option") {
      newOptions[index].option = value;
    } else {
      newOptions[index].odds = parseFloat(value) || 1;
    }
    setOptions(newOptions);
  };

  const handlePublishMarket = () => {
    setShowLaunchModal(false);
    setMarketTitle("");
    setMarketRules("");
    setMarketOpens("");
    setMarketCloses("");
    setOptions([{ option: "", odds: 1 }]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Everglades Challenge
                  </h1>
                  <p className="text-sm text-slate-600">
                    Control Dashboard • Florida Keys
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLaunchModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch New Market
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">
                  Active Teams
                </p>
                <div className="w-5 h-5 text-slate-400">⚡</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">42</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Prize Pool</p>
                <div className="w-5 h-5 text-slate-400">⊙</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">$25,000</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Markets</p>
                <div className="w-5 h-5 text-slate-400">⊕</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">1</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Volume</p>
                <div className="w-5 h-5 text-slate-400">📊</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">$8.4K</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">⊙</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Current Leaderboard
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    rank: 1,
                    team: "Apex Predators",
                    logs: "14 logs",
                    score: "1240",
                  },
                  {
                    rank: 2,
                    team: "Sea Serpent II",
                    logs: "11 logs",
                    score: "1105",
                  },
                  { rank: 3, team: "Blue Wave", logs: "9 logs", score: "980" },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {item.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.team}
                        </p>
                        <p className="text-xs text-slate-600">{item.logs}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900">{item.score}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Open Betting Markets
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Winning Weight Prediction
                  </h3>
                  <div className="grid grid-cols-1 gap-4 overflow-y-auto h-[116px]">
                    <div className="flex justify-between items-center border-1 rounded-md p-3 ">
                      <p className="text-md font-semibold text-slate-600 ">
                        Team Apex
                      </p>
                      <p className="text-md font-bold text-primary">2.50x</p>
                    </div>
                    <div className="flex justify-between items-center border-1 rounded-md p-3">
                      <p className="text-md font-semibold text-slate-600 ">
                        Sea Serpent
                      </p>
                      <p className="text-md font-bold text-primary">3.10x</p>
                    </div>
                    <div className="flex justify-between items-center border-1 rounded-md p-3">
                      <p className="text-mdfont-semibold text-slate-600 ">
                        Ocean Drifter
                      </p>
                      <p className="text-md font-bold text-primary">1.80x</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex gap-4">
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 w-[50%] bg-foreground text-white font-medium rounded-lg  transition-colors">
                    SETTLE MARKET
                  </button>
                  <button className="inline-flex w-[50%]  items-center justify-center gap-2 px-4 py-2.5  text-red-400 font-medium rounded-lg  transition-colors border">
                    STOP MARKET
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Submission Feed
                </h2>
              </div>
              <Link
                href={`/dashboard/tournaments/${tournamentId}/teams`}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View Full Detail Feed
              </Link>
            </div>

            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={3} // desktop: 3 cards
              breakpoints={{
                320: { slidesPerView: 1 }, // mobile 1 card
                640: { slidesPerView: 1.2 }, // thoda peek effect
                768: { slidesPerView: 2 }, // tablet 2 cards
                1024: { slidesPerView: 3 }, // desktop 3 cards
              }}
              className="py-4"
            >
              {mockSubmissions.map((submission) => (
                <SwiperSlide key={submission.id} className="!w-[30%]">
                  {" "}
                  {/* width 30% */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 w-full bg-slate-200">
                      <Image
                        src={submission.image}
                        alt={submission.species}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            submission.status === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {submission.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {submission.captain[0]}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {submission.captain}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 mb-1">
                        {submission.species}
                      </p>
                      <p className="text-xs text-slate-600 mb-4">
                        {submission.weight}
                      </p>

                      <button className="w-full px-3 py-2 text-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                        Verify Details
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </main>
      </div>

      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Launch New Betting Market
              </h2>
              <button
                onClick={() => setShowLaunchModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  MARKET TITLE
                </label>
                <input
                  type="text"
                  value={marketTitle}
                  onChange={(e) => setMarketTitle(e.target.value)}
                  placeholder="e.g. Winner Prediction"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  MARKET RULES & CONDITIONS
                </label>
                <textarea
                  value={marketRules}
                  onChange={(e) => setMarketRules(e.target.value)}
                  placeholder="Specify winning conditions clearly..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    MARKET OPENS
                  </label>
                  <input
                    type="datetime-local"
                    value={marketOpens}
                    onChange={(e) => setMarketOpens(e.target.value)}
                    placeholder="14/02/2026, 12:30"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    MARKET CLOSES
                  </label>
                  <input
                    type="datetime-local"
                    value={marketCloses}
                    onChange={(e) => setMarketCloses(e.target.value)}
                    placeholder="14/02/2026, 12:30"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    OUTCOME OPTIONS & ODDS
                  </label>
                  <button
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </button>
                </div>

                <div className="space-y-3">
                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <input
                        type="text"
                        value={opt.option}
                        onChange={(e) =>
                          handleOptionChange(index, "option", e.target.value)
                        }
                        placeholder="e.g. Team Apex"
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={opt.odds}
                          onChange={(e) =>
                            handleOptionChange(index, "odds", e.target.value)
                          }
                          placeholder="1"
                          className="w-20 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-center"
                          step="0.1"
                          min="0"
                        />
                        <span className="text-slate-500 text-sm">@pds</span>
                      </div>
                      {index > 0 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handlePublishMarket}
                  className="flex-1 px-4 py-3 bg-dark-navy text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  CONFIRM & PUBLISH MARKET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
