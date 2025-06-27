export async function getAllAccounts() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch("/api/manager/accounts", { headers: authHeader });
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function getAccountById(id) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/manager/accounts/${id}`, {
    headers: authHeader,
  });
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function updateAccount(id, data) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/manager/accounts/${id}`, {
    method: "PUT",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function deleteAccount(id) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/manager/accounts/${id}`, {
    method: "DELETE",
    headers: authHeader,
  });
  if (!res.ok) throw new Error("API error");
  return true;
}

export async function updateRole(data) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch("/api/user/api/manager/updaterole", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("API error");
  return await res.json();
}
