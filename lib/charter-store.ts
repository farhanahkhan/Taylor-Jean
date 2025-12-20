export interface Charter {
  id: string;
  fullName: string;
  email: string;
  charterDate: string;
  charterType: string;
  amount: number;
  createdAt: string;
}

// API response ka type
interface CharterApiItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  preferredDate: string;
  amount: number;
  createdAt?: string;
}

interface CharterApiResponse {
  data: CharterApiItem[];
}

// API URL
const API_URL = "/api/charter-bookingList";

// Fetch function
export async function getCharters(): Promise<Charter[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  const json: CharterApiResponse = await res.json(); // <-- type-safe

  return json.data.map((item) => ({
    id: item.id,
    fullName: `${item.firstName} ${item.lastName}`,
    email: item.email,
    charterDate: item.preferredDate.split("T")[0],
    charterType: "Private Charter", // backend me nahi hai
    amount: item.amount ?? 0,
    createdAt: item.createdAt
      ? item.createdAt.split("T")[0]
      : item.preferredDate.split("T")[0],
  }));
}
