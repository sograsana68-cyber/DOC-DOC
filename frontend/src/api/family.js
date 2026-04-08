import api from "./client.js";

export async function fetchFamilyMembers() {
  const { data } = await api.get("/api/family-members");
  return data;
}

export async function fetchMemberDocuments(memberId) {
  const { data } = await api.get(`/api/family-members/${memberId}/documents`);
  return data;
}
