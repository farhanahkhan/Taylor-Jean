"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, Calendar, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
import {
  getTournaments,
  addTournament,
  type Tournament,
} from "@/lib/tournament-store";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

const allowableSpecies = [
  "Blue Marlin",
  "White Marlin",
  "Sailfish",
  "Yellowfin Tuna",
  "Bluefin Tuna",
  "Mahi Mahi",
  "Wahoo",
  "Swordfish",
  "King Mackerel",
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    marina: "",
    tournamentType: "",
    startDate: "",
    endDate: "",
    entryFee: "",
    pointsPerLb: "",
    teamCap: "",
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaunchTournament = () => {
    // Validate required fields
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Format dates for display (e.g., "Nov 12")
    const startDateObj = new Date(formData.startDate);
    const displayDate = startDateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const newTournament = addTournament({
      title: formData.title,
      description: formData.description || "Exciting fishing tournament event.",
      image: bannerPreview || "/placeholder.svg",
      marina: formData.marina || "TBD",
      tournamentType: formData.tournamentType || "Big Game / Pelagic",
      startDate: formData.startDate,
      endDate: formData.endDate,
      allowableSpecies: selectedSpecies,
      entryFee: Number(formData.entryFee) || 0,
      pointsPerLb: Number(formData.pointsPerLb) || 0,
      teamCap: Number(formData.teamCap) || 0,
      status: "ACTIVE",
    });

    // Update local state
    setTournaments(getTournaments());

    // Reset form
    setIsModalOpen(false);
    setSelectedSpecies([]);
    setBannerPreview(null);
    setFormData({
      title: "",
      description: "",
      marina: "",
      tournamentType: "",
      startDate: "",
      endDate: "",
      entryFee: "",
      pointsPerLb: "",
      teamCap: "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  My Tournaments
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage your event lifecycles and payouts.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={tournament.image || "/placeholder.svg"}
                    alt={tournament.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-md">
                      {tournament.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {tournament.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {tournament.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(tournament.startDate)} -{" "}
                        {formatDate(tournament.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{tournament.teams} Teams</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Initialize New Tournament
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Tournament Banner */}
                <div>
                  <Label className="text-xs font-medium text-slate-500 uppercase mb-2 block">
                    Tournament Banner
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="banner-upload"
                      className="flex flex-col items-center justify-center h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      {bannerPreview ? (
                        <Image
                          src={bannerPreview || "/placeholder.svg"}
                          alt="Banner preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Image
                            src="/generic-image-icon.png"
                            alt="Upload"
                            width={32}
                            height={32}
                            className="mb-2"
                          />
                          <p className="text-sm font-medium text-slate-600">
                            Click to upload banner
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Optimal size: 1200x600px
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Event Title */}
                <div>
                  <Label
                    htmlFor="event-title"
                    className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                  >
                    Event Title
                  </Label>
                  <input
                    id="event-title"
                    placeholder="e.g. 2024 Ocean City Billfish Open"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                  >
                    Description
                  </Label>
                  <input
                    id="description"
                    placeholder="Brief description of the tournament"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Marina/Port and Tournament Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="marina"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      Marina / Port
                    </Label>
                    <input
                      id="marina"
                      placeholder="Sunset Marina"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={formData.marina}
                      onChange={(e) =>
                        handleInputChange("marina", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="tournament-type"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      Tournament Type
                    </Label>
                    <Select
                      value={formData.tournamentType}
                      onValueChange={(value) =>
                        handleInputChange("tournamentType", value)
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary">
                        <SelectValue placeholder="Big Game / Pelagic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="big-game">
                          Big Game / Pelagic
                        </SelectItem>
                        <SelectItem value="inshore">Inshore</SelectItem>
                        <SelectItem value="offshore">Offshore</SelectItem>
                        <SelectItem value="mixed">Mixed Species</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="start-date"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      Start Date
                    </Label>
                    <input
                      id="start-date"
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="end-date"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      End Date
                    </Label>
                    <input
                      id="end-date"
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Allowable Species */}
                <div>
                  <Label className="text-xs font-medium text-slate-500 uppercase mb-2 block">
                    Allowable Species
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {allowableSpecies.map((species) => (
                      <button
                        key={species}
                        onClick={() => toggleSpecies(species)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedSpecies.includes(species)
                            ? "bg-primary/10 text-primary border-primary/10"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {species}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financials & Scoring */}
                <div>
                  <Label className="text-xs font-medium text-slate-500 uppercase mb-3 block">
                    Financials & Scoring
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor="entry-fee"
                        className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                      >
                        Entry Fee ($)
                      </Label>
                      <input
                        id="entry-fee"
                        type="number"
                        placeholder="500"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.entryFee}
                        onChange={(e) =>
                          handleInputChange("entryFee", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="points-lb"
                        className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                      >
                        Points / LB
                      </Label>
                      <input
                        id="points-lb"
                        type="number"
                        placeholder="10"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.pointsPerLb}
                        onChange={(e) =>
                          handleInputChange("pointsPerLb", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="team-cap"
                        className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                      >
                        Team Cap
                      </Label>
                      <input
                        id="team-cap"
                        type="number"
                        placeholder="50"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.teamCap}
                        onChange={(e) =>
                          handleInputChange("teamCap", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    onClick={handleLaunchTournament}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-dark-navy rounded-lg hover:bg-navy transition-colors"
                  >
                    <span>⚡</span>
                    Launch Tournament
                  </button>
                  <p className="text-xs text-center text-slate-400 mt-3">
                    Drafts are saved automatically. Listing will be visible to
                    Captains after launch.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
