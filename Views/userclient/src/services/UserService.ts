import Api from "./Api";

const baseURL = "users/v1";

export default {
  async login(email: string, password: string) {
    const { data } = await Api().post(
      `${baseURL}/login`,
      { email, password },
      { withCredentials: true }
    );

    console.log(data);

    return data;
  },

  async teste() {
    const { data } = await Api(true).get(`${baseURL}/teste`);

    return data;
  },

  async logout() {

    const { data } = await Api().post(`${baseURL}/logout`, null, {
      withCredentials: true,
    });

    localStorage.removeItem("Access_token");
  },

  async refreshToken() {
    const { data } = await Api(true).post(`${baseURL}/refreshToken`, null, {
      withCredentials: true,
    });

    return data;
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
    return Api().post(`${baseURL}//recover-password/confirmation`, {
      token,
      password,
    });
  },

  recoverUserPasswordEmailRequest(email: string) {
    return Api().get(`${baseURL}/recover-password/request/${email}`);
  },
};
