import { handleSessionExpired } from "./sessionExpired";

export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    await handleSessionExpired();
    throw new Error("Session expired");
  }

  return res;
};
