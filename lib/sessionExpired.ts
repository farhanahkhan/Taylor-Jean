import Swal from "sweetalert2";

let isPopupOpen = false;

export const handleSessionExpired = async () => {
  if (isPopupOpen) return;

  isPopupOpen = true;

  await Swal.fire({
    icon: "warning",
    title: "Session Expired",
    text: "Your session has expired. Please login again.",
    confirmButtonText: "Login",
    allowOutsideClick: false,
  });

  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "/login";
};

export const handleServerError = async (
  message = "Something went wrong. Please try again.",
) => {
  if (isPopupOpen) return;

  isPopupOpen = true;

  await Swal.fire({
    icon: "error",
    title: "Something Went Wrong",
    text: message,
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });

  isPopupOpen = false;
};
