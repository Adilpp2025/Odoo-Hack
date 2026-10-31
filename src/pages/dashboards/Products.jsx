import { useState } from "react";
import { Search, Plus, Package, X, Trash2 } from "lucide-react";
import "./Products.css";

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cloud Storage",
      type: "Service",
      sales_price: 499,
      cost_price: 200,
      notes: "Online cloud storage service",
    },
    {
      id: 2,
      name: "Premium Support",
      type: "Service",
      sales_price: 999,
      cost_price: 400,
      notes: "Priority customer support",
    },
    {
      id: 3,
      name: "Business Software",
      type: "Service",
      sales_price: 1499,
      cost_price: 700,
      notes: "Business management software",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "Service",
    sales_price: "",
    cost_price: "",
    notes: "",
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (e) => {
    e.preventDefault();

    setProducts([
      ...products,
      {
        id: Date.now(),
        ...newProduct,
        sales_price: Number(newProduct.sales_price),
        cost_price: Number(newProduct.cost_price),
      },
    ]);

    setNewProduct({
      name: "",
      type: "Service",
      sales_price: "",
      cost_price: "",
      notes: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <h1>Products Management</h1>
          <p>Create and manage your business products and services.</p>
        </div>

        <button
          className="add-product-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="products-summary">
        <Package size={25} />
        <div>
          <p>Total Products</p>
          <h2>{products.length}</h2>
        </div>
      </div>

      <div className="products-table-container">
        <div className="products-toolbar">
          <div className="products-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>TYPE</th>
                <th>SALES PRICE</th>
                <th>COST PRICE</th>
                <th>NOTES</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.type}</td>
                  <td>₹{product.sales_price}</td>
                  <td>₹{product.cost_price}</td>
                  <td>{product.notes || "-"}</td>
                  <td>
                    <button
                      className="delete-product-button"
                      onClick={() => handleDelete(product.id)}
                      title="Delete product"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="no-products">No products found.</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="product-modal-heading">
              <h2>Add New Product</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />

              <label>Product Type</label>
              <select
                value={newProduct.type}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, type: e.target.value })
                }
              >
                <option value="Service">Service</option>
                <option value="Goods">Goods</option>
              </select>

              <label>Sales Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.sales_price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    sales_price: e.target.value,
                  })
                }
                required
              />

              <label>Cost Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.cost_price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    cost_price: e.target.value,
                  })
                }
                required
              />

              <label>Notes</label>
              <textarea
                value={newProduct.notes}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, notes: e.target.value })
                }
                placeholder="Enter product notes"
              />

              <button type="submit" className="save-product-button">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;