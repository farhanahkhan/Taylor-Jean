export const apiFetch = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    alert("Session expired. Please login again.");

    window.location.href = "/login";
  }

  return res;
};
