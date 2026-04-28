import { useState, useEffect, useCallback } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../services/api";

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchItems();
      setItems(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = async (item) => {
    setMutationError(null);
    try {
      const res = await createItem(item);
      setItems((prev) => [res.data, ...prev]);
    } catch (err) {
      setMutationError(err.message);
      throw err;
    }
  };

  const editItem = async (id, item) => {
    setMutationError(null);
    try {
      const res = await updateItem(id, item);
      setItems((prev) => prev.map((i) => (i._id === id ? res.data : i)));
    } catch (err) {
      setMutationError(err.message);
      throw err;
    }
  };

  const removeItem = async (id) => {
    setMutationError(null);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setMutationError(err.message);
      throw err;
    }
  };

  return { items, loading, error, mutationError, addItem, editItem, removeItem, reload: load };
};

