"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar,
  Users,
  MoreVertical,
  Trash2,
  Pencil,
  MapPin,
} from "lucide-react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
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
import Link from "next/link";
import { mutate } from "swr";

interface TournamentType {
  id: string;
  name: string;
  isActive: boolean;
}

interface Species {
  id: string;
  name: string;
  isActive: boolean;
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  imageUrl?: string;
  entryFee?: number;
  points?: number;
  latitude?: number;
  longitude?: number;
  place?: string;
  tournamentType?: string;
  tournamentTypeId?: string;
  typeId?: string;
  image?: string;
  banner?: string;
  bannerUrl?: string;
  tournamentSpecies?: {
    speciesId: string;
    points: number;
  }[];
}

interface TournamentAPIResponse {
  data: Omit<Tournament, "title">[];
}

export default function TournamentsPage() {
  // 🛠️ REFRESH FIX 1: Internal Component Refresh Key
  const [pageRefreshKey, setPageRefreshKey] = useState(0);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [tournamentTypes, setTournamentTypes] = useState<TournamentType[]>([]);
  const [allowableSpecies, setAllowableSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<
    { speciesId: string; points: string | number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);

  const router = useRouter();

  const MapComponent = dynamic(() => import("../../Components/MapComponent"), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
        Loading Map Engine...
      </div>
    ),
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tournamentType: "",
    startDate: "",
    endDate: "",
    entryFee: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    location: "",
  });

  const resetForm = useCallback(() => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      tournamentType: "",
      startDate: "",
      endDate: "",
      entryFee: "",
      latitude: "",
      longitude: "",
      imageUrl: "",
      location: "",
    });
    setSelectedSpecies([]);
    setUploadedImageUrl("");
    setBannerPreview(null);
    setSelectedPosition(null);
  }, []);

  // 🛠️ REFRESH FIX 2: Internal refresh function bina hard reload kiye
  const triggerInternalRefresh = useCallback(() => {
    resetForm();
    setIsMapOpen(false);
    setIsModalOpen(false);
    // Key change hote hi React is pure component ko memory se flush karke naya render karega
    setPageRefreshKey((prev) => prev + 1);
  }, [resetForm]);

  useEffect(() => {
    const fetchTournamentTypes = async () => {
      const res = await fetch("/api/tournament-types?type=tournament-types");
      const result: { data: TournamentType[] } = await res.json();
      setTournamentTypes(result.data);
    };
    fetchTournamentTypes();
  }, [pageRefreshKey]); // Key par dependencies add kardi

  useEffect(() => {
    const fetchSpecies = async () => {
      const res = await fetch("/api/tournament-types?type=species");
      const result: { data: Species[] } = await res.json();
      setAllowableSpecies(result.data);
    };
    fetchSpecies();
  }, [pageRefreshKey]);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tournaments");
      const data: TournamentAPIResponse = await res.json();

      const tournamentsWithTitle: Tournament[] = data.data.map((t) => ({
        ...t,
        title: t.name ?? "",
        imageUrl: t.imageUrl ?? t.image ?? t.banner ?? t.bannerUrl ?? "",
        tournamentTypeId: t.tournamentTypeId ?? t.typeId ?? "",
      }));

      setTournaments(tournamentsWithTitle);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [pageRefreshKey]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaunchTournament = async () => {
    const finalImage = uploadedImageUrl || formData.imageUrl;

    if (!finalImage) {
      alert("Please upload a tournament banner first!");
      return;
    }

    const payload = {
      name: formData.title,
      place: formData.location || "",
      tournamentTypeId: formData.tournamentType,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      latitude: Number(selectedPosition?.[0]) || Number(formData.latitude) || 0,
      longitude:
        Number(selectedPosition?.[1]) || Number(formData.longitude) || 0,
      entryFee: Number(formData.entryFee) || 0,
      description: formData.description || "",
      imageUrl: finalImage,
      tournamentSpecies: selectedSpecies.map((s) => ({
        speciesId: s.speciesId,
        points: Number(s.points),
      })),
    };

    const url = isEditMode
      ? `/api/tournaments/${editingId}`
      : `/api/tournaments`;
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert(isEditMode ? "Tournament updated!" : "Tournament created!");

    // 🛠️ REFRESH FIX 3: Edit/Save success par internal reload
    triggerInternalRefresh();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this tournament?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }
      alert("Tournament deleted successfully");
      fetchTournaments();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const toggleSpecies = (speciesId: string) => {
    setSelectedSpecies((prev) => {
      const exists = prev.find(
        (s) => String(s.speciesId) === String(speciesId),
      );
      if (exists) {
        return prev.filter((s) => String(s.speciesId) !== String(speciesId));
      }
      return [...prev, { speciesId, points: "" }];
    });
  };

  const handlePointChange = (speciesId: string, value: string) => {
    setSelectedSpecies((prev) =>
      prev.map((item) =>
        item.speciesId === speciesId
          ? { ...item, points: Number(value) }
          : item,
      ),
    );
  };

  const handleLocationInput = (value: string) => {
    setFormData((prev) => ({ ...prev, location: value }));
  };

  const handleEdit = (tournament: Tournament) => {
    setIsEditMode(true);
    setEditingId(tournament.id);

    const typedTarget = tournamentTypes.find(
      (type) =>
        type.name === tournament.tournamentType ||
        type.id === tournament.tournamentTypeId,
    );

    setFormData({
      title: tournament.name || "",
      description: tournament.description || "",
      tournamentType: typedTarget?.id || tournament.tournamentTypeId || "",
      startDate: tournament.startDate?.split("T")[0] || "",
      endDate: tournament.endDate?.split("T")[0] || "",
      entryFee: String(tournament.entryFee || 0),
      latitude: String(tournament.latitude || 0),
      longitude: String(tournament.longitude || 0),
      imageUrl: tournament.imageUrl || "",
      location: tournament.place || "",
    });

    if (tournament.latitude && tournament.longitude) {
      setSelectedPosition([tournament.latitude, tournament.longitude]);
    }

    setUploadedImageUrl(tournament.imageUrl || "");
    setBannerPreview(tournament.imageUrl || "");

    const species = tournament.tournamentSpecies ?? [];
    setSelectedSpecies(
      Array.isArray(species)
        ? species
            .filter((s) => s?.speciesId)
            .map((s) => ({
              speciesId: String(s.speciesId),
              points: Number(s.points ?? 0),
            }))
        : [],
    );
    fetchTournaments();
    setIsModalOpen(true);
  };

  return (
    // 🛠️ REFRESH FIX 4: Pure layout container ko dynamic key assign kar di taake dom cleanup instant ho
    <div key={pageRefreshKey} className="flex min-h-screen bg-slate-900">
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
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-700">
                  Loading tournaments...
                </span>
              </div>
            ) : tournaments.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No tournaments found.
              </p>
            ) : (
              tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <Link href={`/dashboard/tournaments/${tournament.id}/teams`}>
                    <div className="relative h-48 cursor-pointer">
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

                    <div className="p-5 cursor-pointer">
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
                  </Link>

                  <div className="flex justify-end p-3">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content
                        align="end"
                        className="bg-white border rounded-lg shadow-lg p-1 z-50 min-w-[140px]"
                      >
                        <DropdownMenu.Item
                          onSelect={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(tournament);
                          }}
                          className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onSelect={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(tournament.id);
                          }}
                          className="px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 cursor-pointer outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dialog Root */}
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                // 🛠️ REFRESH FIX 5: Jab user modal se bahar click karega toh dynamic internal refresh chalega
                triggerInternalRefresh();
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => {
                if (isMapOpen) e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {isEditMode
                    ? "Modify Tournament Details"
                    : "Initialize New Tournament"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <Label className="text-xs font-medium text-slate-500 uppercase mb-2 block">
                    Tournament Banner
                  </Label>
                  <ImageUploader
                    onUploadSuccess={(finalImageUrl) => {
                      setUploadedImageUrl(finalImageUrl);
                      setBannerPreview(finalImageUrl);
                    }}
                  />
                  {bannerPreview && (
                    <div className="mt-4 relative w-50 h-40 rounded-lg overflow-hidden border">
                      <Image
                        src={bannerPreview}
                        alt="Tournament Banner"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <Label
                      htmlFor="location"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      Tournament Location
                    </Label>
                    <div className="relative">
                      <input
                        id="location"
                        type="text"
                        placeholder="Select location from map"
                        onChange={(e) => handleLocationInput(e.target.value)}
                        className="w-full pr-12 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.location}
                      />
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {isMapOpen && (
                    <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Select Tournament Location</DialogTitle>
                        </DialogHeader>
                        <div className="w-full h-[500px] rounded-lg overflow-hidden border">
                          <MapComponent
                            setFormData={setFormData}
                            setSelectedPosition={setSelectedPosition}
                            selectedPosition={selectedPosition}
                            setIsMapOpen={setIsMapOpen}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="tournament-type"
                      className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                    >
                      Tournament Type
                    </Label>
                    <Select
                      value={formData.tournamentType || undefined}
                      onValueChange={(value) =>
                        handleInputChange("tournamentType", value)
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary">
                        <SelectValue placeholder="Select Tournament Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tournamentTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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

                <div>
                  <Label className="text-xs font-medium text-slate-500 uppercase mb-2 block">
                    Allowable Species
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {allowableSpecies.map((species) => {
                      const isSelected = selectedSpecies.some(
                        (s) => String(s.speciesId) === String(species.id),
                      );

                      return (
                        <div key={species.id} className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleSpecies(species.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex justify-between ${
                              isSelected
                                ? "bg-primary/10 text-primary border-primary"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-gray-100"
                            }`}
                          >
                            {species.name}
                          </button>

                          {isSelected && (
                            <input
                              type="number"
                              placeholder="Enter points"
                              value={
                                selectedSpecies.find(
                                  (s) => s.speciesId === species.id,
                                )?.points ?? ""
                              }
                              onChange={(e) =>
                                handlePointChange(species.id, e.target.value)
                              }
                              className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

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
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLaunchTournament}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <span>⚡</span>
                    {isEditMode ? "Save Changes" : "Create Tournament"}
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
