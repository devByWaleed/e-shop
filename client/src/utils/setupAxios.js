import axios from "axios";

// Only ONE refresh at a time; other failed requests wait for it
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const status = error.response?.status;
        const url = original?.url || "";

        // Try to refresh only once per request, and never for login, admin, or the refresh call itself
        const skip =
            status !== 401 ||
            !original ||
            original._retry ||
            url.includes("/api/auth/refresh") ||
            url.includes("login") ||
            url.includes("/api/admin")
        // ||
        // url.includes("/api/user/profile") ||
        // url.includes("/api/seller/seller-profile") ||
        // url.includes("/api/admin/verify-admin");

        if (skip) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axios
                    .post("/api/auth/refresh", {}, { withCredentials: true })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;
            return axios(original);   // repeat the original request with the new cookie
        } catch (refreshError) {
            return Promise.reject(error);   // refresh failed: the user really is logged out
        }
    }
);
