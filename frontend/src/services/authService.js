import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/auth`;

// Login
export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

// Register
export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

// Change Password
export const changePassword = (data) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};