"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { getCrewMembers, addCrewMember, searchAnglers } from "@/lib/crew-store";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Settings, Users } from "lucide-react";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { TeamHeader } from "@/app/Components/team-header";
import type { AvailableAngler } from "@/lib/crew-store";

export default function CrewRosterPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: crewMembers = [] } = useSWR("crew-members", getCrewMembers);
  const searchResults = searchAnglers(searchQuery);

  const handleAddMember = (angler: AvailableAngler) => {
    addCrewMember(angler, "ANGLER");
    mutate("crew-members");
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeamSidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />
        <main className="flex-1 p-6 md:p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crew Roster</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your mates, anglers, and vessel permissions.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-navy text-white hover:bg-dark rounded-lg transition-colors font-medium"
            >
              <span className="text-lg leading-none">+</span>
              Add Member
            </button>
          </div>

          {/* Crew Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settings
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {crewMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  {/* Name Column */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center bg-primary/10 justify-center text-primary font-semibold text-sm">
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  {/* Role Column */}
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary uppercase">
                      {member.role}
                    </span>
                  </div>

                  {/* Status Column */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">
                      {member.status}
                    </span>
                  </div>

                  {/* Settings Column */}
                  <div className="flex justify-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Member Modal */}
          <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-50">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Search & Add Crew Member
                  </Dialog.Title>
                  <Dialog.Close className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </Dialog.Close>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Search Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Find Registered Anglers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Start typing a name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Results Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Select a user to add ({searchResults.length} results)
                    </label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                      {searchResults.map((angler) => (
                        <div
                          key={angler.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10  rounded-full flex items-center justify-center text-primary bg-primary/10 font-semibold text-sm">
                              {angler.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {angler.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {angler.email}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddMember(angler)}
                            className="px-4 py-2 bg-dark-navy text-white hover:bg-dark text-sm font-medium rounded-lg transition-colors"
                          >
                            Add to Team
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Text */}
                  <p className="text-sm text-gray-500 text-center">
                    Users added here are instantly registered as active crew for
                    your vessel.
                  </p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </main>
      </div>
    </div>
  );
}
