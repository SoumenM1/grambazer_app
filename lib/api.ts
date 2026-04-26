import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.0.116:5001/api",
  // baseURL: "https://server.gramseba.in/api",
  // timeout: 5000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};