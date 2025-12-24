"use client";

import { useState } from "react";

import { X } from "lucide-react";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { TeamHeader } from "@/app/Components/team-header";

export default function VesselProfilePage() {
  const [teamName, setTeamName] = useState("Apex Predators");
  const [vesselName, setVesselName] = useState("The Sea Serpent");
  const [vesselBio, setVesselBio] = useState(
    "Custom-built 50ft sport fisher. We specialize in deep sea billfish and extreme weather runs."
  );
  const [length, setLength] = useState("50");
  const [engines, setEngines] = useState("Twin V12");
  const [electronics, setElectronics] = useState([
    "Garmin Pro",
    "FLIR Night Vision",
    "Side-scan Sonar",
  ]);

  const removeElectronics = (item: string) => {
    setElectronics(electronics.filter((e) => e !== item));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Vessel Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configure your team and boat for public discovery.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  VERIFICATION:
                </span>
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
                  PENDING
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BASIC INFORMATION - Left Column */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  BASIC INFORMATION
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Team / Fleet Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vessel Display Name
                    </label>
                    <input
                      type="text"
                      value={vesselName}
                      onChange={(e) => setVesselName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vessel Bio
                    </label>
                    <textarea
                      value={vesselBio}
                      onChange={(e) => setVesselBio(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* TECHNICAL SPECS - Right Column */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  TECHNICAL SPECS
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Length (ft)
                      </label>
                      <input
                        type="text"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Engines
                      </label>
                      <input
                        type="text"
                        value={engines}
                        onChange={(e) => setEngines(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Electronics Package
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {electronics.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-foreground rounded-lg"
                        >
                          {item}
                          <button
                            onClick={() => removeElectronics(item)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 mt-6 border-t border-border">
              <button className="px-6 py-2.5 bg-dark-navy text-white hover:bg-dark text-sm font-medium rounded-lg transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
