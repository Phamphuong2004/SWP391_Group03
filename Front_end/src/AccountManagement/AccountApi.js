import axios from "axios";

export async function getAllAccounts() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get("/api/manager/accounts", {
    headers: authHeader,
  });
  return res.data;
}

export async function getAccountById(id) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get(`/api/manager/accounts/${id}`, {
    headers: authHeader,
  });
  return res.data;
}

export async function updateAccount(id, data) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.put(`/api/manager/accounts/${id}`, data, {
    headers: authHeader,
  });
  return res.data;
}

export async function deleteAccount(id) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  await axios.delete(`/api/manager/accounts/${id}`, {
    headers: authHeader,
  });
  return true;
}

export async function updateRole({ username, newRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(
    "/api/user/api/manager/updaterole",
    {}, // body rỗng
    {
      headers: authHeader,
      params: {
        username,
        newRole,
      },
    }
  );
  return res.data;
}
