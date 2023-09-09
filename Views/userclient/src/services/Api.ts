import axios from "axios";
import UserService from "./UserService";

export default (requiresAuth = false) => {
  const instance = axios.create({
    baseURL: `http://localhost`,
  });

  if (requiresAuth) {
    const access_Token = localStorage.getItem("Access_token") as string;
    if(access_Token){
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_Token}`;
    }
  }

  // Response interceptor for API calls
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const data = await UserService.refreshToken();
        if (!data.access_token) {
          return Promise.reject(error);
        }
        localStorage.setItem('Access_token', data.access_token as string)
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
