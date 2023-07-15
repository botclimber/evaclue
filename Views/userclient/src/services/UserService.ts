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

  recoverUserPasswordConfirmation(token: string, password: string) {
    return Api().post(`${baseURL}/recover-password/confirmation`, {
      token,
      password
    });
  },

  recoverUserPasswordEmailRequest(email: string) {
    return Api().get(`${baseURL}/recover-password/request/${email}`);
  },
};
