// NOTE: import isBrowser from "@/utils/isBrowser";
import { jwtDecode } from 'jwt-decode';

export function setToken(token) {
  localStorage.setItem('accessToken', token);
}
export function getToken() {
  return localStorage.getItem('accessToken');
}
export const getLastWorkspace = () => {
  return JSON.parse(localStorage?.getItem('user'));
};

export function removeToken() {
  localStorage.clear();
  // NOTE: localStorage.removeItem('accessToken');
}

export const verifyToken = (token) => {
  const { exp } = jwtDecode(token);
  if (new Date(exp * 1000) >= new Date()) {
    return true;
  } else {
    return false;
  }
};
