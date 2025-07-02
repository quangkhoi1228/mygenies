// "use client";

import axios from "axios";

const axiosExternal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosExternalFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosExternal.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("Authorization");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const setToken = (token: string) => {
  localStorage.setItem("Authorization", token);
  axiosExternal.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default axiosExternal;
