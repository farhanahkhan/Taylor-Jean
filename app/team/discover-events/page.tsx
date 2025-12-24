"use client";

import { TeamHeader } from "@/app/Components/team-header";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { Calendar, Globe, Info, X, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const tournaments = [
  {
    id: 1,
    name: "Everglades Challenge",
    location: "Florida Keys",
    description: "Survival fishing in the mangroves.",
    startDate: "2024-11-01",
    image: "/snowy-mountain-landscape-fishing-tournament.jpg",
    entryOpen: true,
  },
  {
    id: 2,
    name: "Grand Banks Billfish",
    location: "Outer Banks",
    description: "Deep sea heavy hitters only.",
    startDate: "2024-12-15",
    image: "/underwater-coral-reef-deep-sea-fishing.jpg",
    entryOpen: true,
  },
  {
    id: 3,
    name: "Gulf Stream Classic",
    location: "Miami",
    description: "Mahi and Tuna showdown.",
    startDate: "2025-01-10",
    image: "/sunset-beach-silhouette-fishing-tournament.jpg",
    entryOpen: true,
  },
];

export default function DiscoverEventsPage() {
  const [selectedTournament, setSelectedTournament] = useState<
    (typeof tournaments)[0] | null
  >(null);

  const handleRegister = (tournament: (typeof tournaments)[0]) => {
    setSelectedTournament(tournament);
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  const handleCompleteRegistration = () => {
    // Handle registration logic here
    console.log("Registering for:", selectedTournament?.name);
    setSelectedTournament(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Tournament Discovery
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Find and register for upcoming events around the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={tournament.image || "/placeholder.svg"}
                    alt={tournament.name}
                    fill
                    className="object-cover"
                  />
                  {tournament.entryOpen && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded">
                        ENTRY OPEN
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {tournament.name}
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {tournament.location}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {tournament.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Starts {tournament.startDate}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRegister(tournament)}
                    className="w-full bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Register Vessel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedTournament && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Register for {selectedTournament.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                    Active Team
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    Sea Serpent II
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteRegistration}
              className="w-full bg-dark-navy hover:bg-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
