import api from "./api";
import { useAuthStore } from "../store/authStore";

export const authService = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    const { token, user } = res.data;
    useAuthStore.getState().setAuth(user, token);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/auth/login", data);
    const { token, user } = res.data;
    useAuthStore.getState().setAuth(user, token);
    return res.data;
  },

  logout: () => {
    useAuthStore.getState().logout();
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    useAuthStore.getState().updateUser(res.data);
    return res.data;
  },
};
