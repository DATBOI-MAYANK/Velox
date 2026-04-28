import { useState } from "react";

const EMPTY = { name: "", description: "", price: "" };

const ItemForm = ({ initial = EMPTY, onSubmit, onCancel, submitLabel = "Save" }) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Name is required.");
    if (form.price === "" || isNaN(Number(form.price)))
      return setError("A valid price is required.");
    try {
      await onSubmit({ ...form, price: Number(form.price) });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="item-form" onSubmit={submit}>
      {error && <p className="form-error">{error}</p>}
      <input
        name="name"
        placeholder="Item name"
        value={form.name}
        onChange={change}
        required
      />
      <input
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={change}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={change}
        min="0"
        step="0.01"
        required
      />
      <div className="form-actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ItemForm;
