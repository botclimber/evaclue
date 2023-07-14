import Api from "./Api";

const baseURL = "user";

export default {
  login(email: string, password: string) {
    return Api().post(`${baseURL}/login`, { email, password });
  },

  loginAdmin(email: string, password: string) {
    return Api().post(`${baseURL}/login/admin`, { email, password });
  },

  register(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) {
    return Api().post(`${baseURL}/register`, {
      firstName,
      lastName,
      username,
      email,
      password,
    });
  },

  updatePassword(id: number, password: string) {
    return Api().post(`${baseURL}/change-password/${id}`, {
      password,
    });
  },

  changePasswordRequest(id: string) {
    return Api().get(`${baseURL}/recover-password/${id}`);
  },
};
