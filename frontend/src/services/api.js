const BASE_URL = "/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchItems = () =>
  fetch(`${BASE_URL}/items`).then(handleResponse);

export const fetchItemById = (id) =>
  fetch(`${BASE_URL}/items/${id}`).then(handleResponse);

export const createItem = (item) =>
  fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  }).then(handleResponse);

export const updateItem = (id, item) =>
  fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  }).then(handleResponse);

export const deleteItem = (id) =>
  fetch(`${BASE_URL}/items/${id}`, { method: "DELETE" }).then(handleResponse);
