import { useState } from "react";
import ItemForm from "./ItemForm";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = async (data) => {
    await onEdit(item._id, data);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item._id);
    } catch {
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div className="item-card editing">
        <ItemForm
          initial={{ name: item.name, description: item.description, price: item.price }}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
          submitLabel="Update"
        />
      </div>
    );
  }

  return (
    <div className={`item-card${deleting ? " deleting" : ""}`}>
      <div className="item-info">
        <h3>{item.name}</h3>
        {item.description && <p className="item-desc">{item.description}</p>}
        <span className="item-price">${Number(item.price).toFixed(2)}</span>
      </div>
      <div className="item-actions">
        <button className="btn-edit" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
