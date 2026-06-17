import { handleSessionExpired, handleServerError } from "./sessionExpired";

export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    await handleSessionExpired();
    throw new Error("Session expired");
  }
  if (res.status === 500) {
    await handleServerError();
    throw new Error("Something went wrong");
  }
  return res;
};
