// small wrapper around fetch so every call sends cookies and JSON headers,
// and throws an error if the server says something went wrong
async function request(path, method, body) {
  const res = await fetch(path, {
    method: method || "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export function getMe() {
  return request("/api/auth/me");
}

export function signup(body) {
  return request("/api/auth/signup", "POST", body);
}

export function login(body) {
  return request("/api/auth/login", "POST", body);
}

export function logout() {
  return request("/api/auth/logout", "POST");
}

export function getAllItems() {
  return request("/api/items");
}

export function getMyItems() {
  return request("/api/items/mine");
}

export function getItem(id) {
  return request(`/api/items/${id}`);
}

export function createItem(body) {
  return request("/api/items", "POST", body);
}

export function updateItem(id, body) {
  return request(`/api/items/${id}`, "PUT", body);
}

export function deleteItem(id) {
  return request(`/api/items/${id}`, "DELETE");
}

export function truncate(text, length = 100) {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  }
  return text;
}
