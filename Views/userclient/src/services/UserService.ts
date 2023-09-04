import Api from "./Api";

const baseURL = "users/v1";

export default {
  login(email: string, password: string) {
    return Api().post(`${baseURL}/login/platform`, { email, password });
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
    return Api().post(`${baseURL}/register/common`, {
      firstName,
      lastName,
      username,
      email,
      password,
    });
  },

  updatePassword(id: number, password: string, token: string) {
    return Api().post(`${baseURL}/updatePassword/${id}/${token}`, {
      password,
    });
  },

  changePasswordRequest(email: string) {
    return Api().put(`${baseURL}/changePassword/${email}`);
  },
};
