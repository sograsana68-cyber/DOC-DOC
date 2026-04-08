import api from "./client.js";

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/api/auth/me");
  return data;
}
