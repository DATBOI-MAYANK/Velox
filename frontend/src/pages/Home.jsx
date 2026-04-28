import { useItems } from "../hooks/useItems";
import ItemCard from "../components/ItemCard";
import ItemForm from "../components/ItemForm";

const Home = () => {
  const { items, loading, error, addItem, editItem, removeItem } = useItems();

  return (
    <main className="page">
      <section className="add-section">
        <h2>Add New Item</h2>
        <ItemForm onSubmit={addItem} submitLabel="Add Item" />
      </section>

      <section className="list-section">
        <h2>Items ({items.length})</h2>
        {loading && <p className="status">Loading…</p>}
        {error && <p className="status error">Error: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="status">No items yet. Add one above!</p>
        )}
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={editItem}
              onDelete={removeItem}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
