import axios from "axios";


axios.interceptors.response.use(response =>{
    return response;
}, err => {
    const {
        config,
        response: {status, data}}=err;
    }