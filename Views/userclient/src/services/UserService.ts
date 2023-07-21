import Api from "./Api";

const baseURL = "user";

export default {
  async login(email: string, password: string) {

    const { data } = await Api(true).post(`${baseURL}/login`, { email, password });
  
    console.log(data);

    return data;
  },

  async teste() {
    const { data } = await Api(true).get(`${baseURL}/teste`);
  
    return data;
  },

  async refreshToken() {
    const { data } = await Api(true).post(`${baseURL}/refreshToken`);
  
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
      password
    });
  },

  recoverUserPasswordEmailRequest(email: string) {
    return Api().get(`${baseURL}/recover-password/request/${email}`);
  },
};
