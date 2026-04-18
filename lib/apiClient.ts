// lib/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    console.log("[axios] headers:", config.headers);
    // Handle FormData — let the browser set the correct Content-Type boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    const message = Array.isArray(response?.data?.message)
      ? response.data.message.join(", ")
      : response?.data?.message || error.message || "Something went wrong";

    if (response?.status === 404) {
      console.warn("[apiClient] Resource not found:", response.config?.url);
    } else if (response?.status >= 500) {
      console.error("[apiClient] Server error:", {
        status: response.status,
        message,
      });
    } else {
      console.error("[apiClient] Request failed:", {
        status: response?.status,
        message,
      });
    }

    return Promise.reject({ ...error, message });
  },
);

export default apiClient;
