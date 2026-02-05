import {jwtDecode} from "jwt-decode";

export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded._id || decoded.userId;
  } catch {
    return null;
  }
};
