import axios from "axios";
import UserService from "./UserService";

export default () => {
  const instance = axios.create({
    baseURL: `http://localhost:7000`,
  });


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
        console.log("new acces token" + data.access_token);
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
