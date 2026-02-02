import axios, { AxiosError } from "axios";

export const runtimeApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

runtimeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

runtimeApi.interceptors.response.use(
  (response) => {
    if (response.data?.errors?.length) {
      const message = response.data.errors[0]?.message || "";
      return Promise.reject(new Error(message));
    }
    return response;
  },

  (error: AxiosError) => {
    console.error("Runtime API Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      sessionStorage.clear();

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  },
);

export default runtimeApi;
