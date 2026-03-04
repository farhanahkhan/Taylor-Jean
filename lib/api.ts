// const BASE_URL = process.env.BASE_URL;
// const DEFAULT_HEADERS = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${process.env.API_TOKEN}`,
// };

// export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// export async function apiRequest<T = unknown>(
//   endpoint: string,
//   method: HttpMethod = "GET",
//   body?: unknown,
//   headers?: Record<string, string>
// ): Promise<T> {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method,
//     headers: { ...DEFAULT_HEADERS, ...headers },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || "API request failed");
//   }

//   return res.json();
// }
import { cookies } from "next/headers";

const BASE_URL = process.env.BASE_URL;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function apiRequest<T = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}
