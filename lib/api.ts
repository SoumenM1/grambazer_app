import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.0.118:5000/api",
  timeout: 10000,
});
