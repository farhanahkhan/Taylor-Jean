// // export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// // export async function apiRequest<T = unknown>(
// //   endpoint: string,
// //   method: HttpMethod = "GET",
// //   body?: unknown
// // ): Promise<T> {
// //   const res = await fetch("/api/proxy", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({
// //       endpoint,
// //       method,
// //       body,
// //     }),
// //   });

// //   if (!res.ok) {
// //     const error = await res.json().catch(() => ({}));
// //     throw new Error(error.message || "API request failed");
// //   }

// //   return res.json();
// // }
// // lib/api.ts

// // lib/api.ts
// // lib/api.ts (client-side compatible)
// export async function apiRequest<T = unknown>(
//   endpoint: string,
//   method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//   body?: unknown
// ): Promise<T> {
//   const accessToken = localStorage.getItem("accessToken");

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//   };

//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || "API request failed");
//   }

//   return res.json();
// }
