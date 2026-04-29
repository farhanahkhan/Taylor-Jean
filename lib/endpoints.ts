// import { apiRequest } from "./api";

// // Pehle KYCRequest type define karo
// export interface KYCRequest {
//   id: string;
//   user: string;
//   email: string;
//   documentType: string;
//   verificationLevel: string;
//   riskScore: number;
//   riskLevel: string;
//   submitted: string;
//   status: "pending" | "approved" | "review" | "rejected";
// }

// // getAllKyc function
// export const getAllKyc = async (): Promise<KYCRequest[]> => {
//   // apiRequest ko generic type ke saath call karo
//   const res = await apiRequest<KYCRequest[] | { data: KYCRequest[] }>(
//     `/api/kyc/admin/all`,
//     "GET"
//   );

//   // normalize response: agar res array hai ya res.data array hai
//   if (Array.isArray(res)) return res;
//   if (Array.isArray(res.data)) return res.data;

//   return [];
// };
