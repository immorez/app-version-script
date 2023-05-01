import axios from "axios";

const instance = axios.create({
  baseURL: "https://itunes.apple.com",
  headers: {
    "Content-Type": "text/javascript",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: false,
});

export default instance;
