import axios from "axios";

export const API = axios.create({
  baseURL: "https://server.gramseba.in/api",
  timeout: 10000,
});
