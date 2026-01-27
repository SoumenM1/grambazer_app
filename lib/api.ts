import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.0.118:5000/api",
  // baseURL: "https://server.gramseba.in/api",
  timeout: 5000,
});
