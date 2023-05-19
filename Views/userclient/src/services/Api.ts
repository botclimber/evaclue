import axios from "axios";

export default () => {
  return axios.create({
    baseURL: `http://localhost:${process.env.VUE_APP_SERVER_PORT}/`,
  });
};
