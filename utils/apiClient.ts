import axios from "axios";
import { getSession } from "next-auth/react";

const ApiClient = () => {
  const defaultOptions = {
    baseURL: process.env.NEST_API,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    async (config) => {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`API Error:`, error);

      if (error.response?.status === 401) {
        console.log("Unauthorized - token may be expired");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default ApiClient();
