import api from "./api";

export const roomService = {
  createRoom: (data) => api.post("/rooms", data).then((r) => r.data),
  getRooms: () => api.get("/rooms").then((r) => r.data),
  getRoomById: (roomId) => api.get(`/rooms/${roomId}`).then((r) => r.data),
  suggestTopic: (mode) =>
    api.get(`/rooms/suggest-topic?mode=${mode}`).then((r) => r.data.topic),
};

export const userService = {
  getDashboard: () => api.get("/users/dashboard").then((r) => r.data),
  getProfile: (id) => api.get(`/users/profile/${id}`).then((r) => r.data),
  getLeaderboard: (type = "global") =>
    api.get(`/users/leaderboard?type=${type}`).then((r) => r.data),
};
