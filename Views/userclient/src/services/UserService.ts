import Api from "./Api";

const baseURL = "user";

export default {
  async login(email: string, password: string) {
    const { data } = await Api().post(`${baseURL}/login`, { email, password });
  
    console.log(data);

    return data;
  },

  async teste() {
    const { data } = await Api().get(`${baseURL}/teste`);
  
    return data;
  },

  async refreshToken() {
    const api =  await Api();
    api.defaults.withCredentials = true;
    const { data } = await api.post(`${baseURL}/refreshToken`, { withCredentials: true });
  
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
    }, { withCredentials: true });
  },

  recoverUserPasswordConfirmation(token: string, password: string) {
    return Api().post(`${baseURL}//recover-password/confirmation`, {
      token,
      password
    });
  },

  recoverUserPasswordEmailRequest(email: string) {
    return Api().get(`${baseURL}/recover-password/request/${email}`);
  },
};
