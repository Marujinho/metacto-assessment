import axios from "axios";
import { queryClient } from "./queryClient";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use((config) => {
  if (["post", "put", "patch", "delete"].includes(config.method ?? "")) {
    const token = getCookie("csrftoken");
    if (token) {
      config.headers["X-CSRFToken"] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/me")
    ) {
      queryClient.setQueryData(["auth", "me"], null);
    }
    return Promise.reject(error);
  }
);

export default api;
