"use client";

import type React from "react";
import tournament from "@/public/snowy-mountain-landscape-fishing-tournament.jpg";

import { useState, useEffect } from "react";
import { Plus, Calendar, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";

// import type { Tournament } from "@/lib/tournament-store";
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
import ImageUploader from "@/app/Components/ImageUploader";

interface TournamentType {
  id: string;
  name: string;
  isActive: boolean;
}
interface Species {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
export interface Tournament {
  id: string;
  name: string;
  title: string; // add title to display in frontend
  startDate: string;
  endDate: string;
  // image?: string;
  status?: string;
  teams?: number;
  description?: string; // add this
  isActive?: boolean;
  imageUrl?: string;
  points?: number;
}

// API response type

interface TournamentAPIResponse {
  data: Omit<Tournament, "title">[]; // API returns 'name', we add 'title'
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  // tournament dropdown api
  const [tournamentTypes, setTournamentTypes] = useState<TournamentType[]>([]);
  const [allowableSpecies, setAllowableSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // New state
  const [teamImage, setTeamImage] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(""); // store finalImageUrl

  useEffect(() => {
    const fetchTournamentTypes = async () => {
      const res = await fetch("/api/tournament-types?type=tournament-types"); // ✅ correct
      const result: { data: TournamentType[] } = await res.json();
      setTournamentTypes(result.data);
    };

    fetchTournamentTypes();
  }, []);

  // Species API
  useEffect(() => {
    const fetchSpecies = async () => {
      const res = await fetch("/api/tournament-types?type=species"); // ✅ correct
      const result: { data: Species[] } = await res.json();
      setAllowableSpecies(result.data);
    };

    fetchSpecies();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    marina: "",
    tournamentType: "",
    startDate: "",
    endDate: "",
    entryFee: "",
    pointsPerLb: "",

    imageUrl: "",
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("/api/tournaments");
        const data: TournamentAPIResponse = await res.json();

        // Safely map API response to include 'title'
        const tournamentsWithTitle: Tournament[] = data.data.map((t) => ({
          ...t,
          // If t.name exists, use it; otherwise fallback to empty string
          title: t.name ?? "",
          image: t.imageUrl ?? "",
        }));

        setTournaments(tournamentsWithTitle);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setIsLoading(false); // Stop loader
      }
    };

    fetchTournaments();
  }, []);

  // const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setBannerPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-banner", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setBannerPreview(data.url); // <- save the URL
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading the banner");
    }
  };

  const toggleSpecies = (speciesId: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(speciesId)
        ? prev.filter((id) => id !== speciesId)
        : [...prev, speciesId]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaunchTournament = async () => {
    if (!uploadedImageUrl) {
      alert("Please upload a tournament banner first!");
      return;
    }
    // Validate required fields
    if (
      !formData.title ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.tournamentType
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Prepare request body according to backend API
      const payload = {
        name: formData.title,
        place: formData.marina || "TBD",
        tournamentTypeId: formData.tournamentType, // id selected from dropdown
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        entryFee: Number(formData.entryFee) || 0,
        points: Number(formData.pointsPerLb) || 0,

        description:
          formData.description || "Exciting fishing tournament event.",
        imageUrl: uploadedImageUrl, // <- persistent image
        speciesIds: selectedSpecies, // array of species ids
      };

      console.log("payload", payload);
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create tournament");
        return;
      }

      alert("Tournament created successfully!");

      // Optionally, refresh tournaments list
      debugger;
      const tournamentsRes = await fetch("/api/tournaments");
      const tournamentsData: TournamentAPIResponse =
        await tournamentsRes.json();
      console.log(tournamentsData);
      setTournaments(
        tournamentsData.data.map((t) => ({
          ...t,
          title: t.name,
          image: t.imageUrl ?? "",
        }))
      );

      // Reset form
      setIsModalOpen(false);
      setSelectedSpecies([]);
      setTeamImage("");
      // setBannerPreview(null);
      setFormData({
        title: "",
        description: "",
        marina: "",
        tournamentType: "",
        startDate: "",
        endDate: "",
        entryFee: "",
        pointsPerLb: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the tournament.");
    }
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
            {isLoading ? (
              // Loader while API is fetching
              <div className="col-span-full flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-700">
                  Loading tournaments...
                </span>
              </div>
            ) : tournaments.length === 0 ? (
              // Show message if no tournaments
              <p className="col-span-full text-center text-gray-500">
                No tournaments found.
              </p>
            ) : (
              // Your existing code for tournament cards
              tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={tournament.imageUrl || "/placeholder.svg"}
                      alt={tournament.title || tournament.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-md">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {tournament.title || tournament.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {tournament.description || "No description available."}
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
                        <span>{tournament.points || 0} Points</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                  {/* <div className="relative">
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
                  </div> */}
                  <ImageUploader
                    onUploadSuccess={(finalImageUrl) => {
                      setUploadedImageUrl(finalImageUrl); // save uploaded URL
                      setBannerPreview(finalImageUrl); // show preview
                    }}
                  />

                  {bannerPreview && (
                    <div className="mt-2 relative w-full h-40 rounded overflow-hidden border border-gray-200">
                      <Image
                        src={bannerPreview}
                        alt="Tournament Banner"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
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
                      value={formData.tournamentType} // stores ID
                      onValueChange={(value: string) =>
                        handleInputChange("tournamentType", value)
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary">
                        <SelectValue placeholder="Select Tournament Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tournamentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} {/* Show name on frontend */}
                          </SelectItem>
                        ))}
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
                        key={species.id}
                        onClick={() => toggleSpecies(species.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedSpecies.includes(species.id)
                            ? "bg-primary/10 text-primary border-primary/10"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-gray-100"
                        }`}
                      >
                        {species.name} {/* Name show */}
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
                    {/* <div>
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
                    </div> */}
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    onClick={handleLaunchTournament}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-dark-navy rounded-lg hover:bg-navy transition-colors"
                  >
                    <span>⚡</span>
                    Create Tournament
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
