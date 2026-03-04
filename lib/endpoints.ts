import { apiRequest } from "./api";

// Close a bet
export const closeBet = (betId: string) =>
  apiRequest(`/api/Bets/${betId}/close`, "POST");

// Get team list
export const getTeams = () => apiRequest(`/api/general-teams/my`, "GET");

// Create team
export const createTeam = (payload: unknown) =>
  apiRequest(`/api/general-teams/create`, "POST", payload);

// Register tournament
export const registerTournament = (payload: unknown) =>
  apiRequest(`/api/tournaments/register`, "POST", payload);
