import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Tag,
  X,
} from "lucide-react";
import "./Discounts.css";

function Discounts() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      name: "New Customer Offer",
      discount_type: "percentage",
      discount_value: 10,
      start_date: "2026-10-01",
      end_date: "2026-12-31",
      usage_limit: 100,
      status: "active",
    },
    {
      id: 2,
      name: "Festive Discount",
      discount_type: "fixed",
      discount_value: 500,
      start_date: "2026-10-15",
      end_date: "2026-11-30",
      usage_limit: 50,
      status: "active",
    },
    {
      id: 3,
      name: "Summer Offer",
      discount_type: "percentage",
      discount_value: 15,
      start_date: "2026-04-01",
      end_date: "2026-05-31",
      usage_limit: 200,
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    discount_type: "percentage",
    discount_value: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    status: "active",
  });

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch = discount.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || discount.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDiscount = (e) => {
    e.preventDefault();

    const newDiscount = {
      id: Date.now(),
      ...formData,
      discount_value: Number(formData.discount_value),
      usage_limit: Number(formData.usage_limit),
    };

    setDiscounts((prev) => [...prev, newDiscount]);

    setFormData({
      name: "",
      discount_type: "percentage",
      discount_value: "",
      start_date: "",
      end_date: "",
      usage_limit: "",
      status: "active",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setDiscounts((prev) =>
        prev.filter((discount) => discount.id !== id)
      );
    }
  };

  return (
    <div className="discounts-page">
      <div className="discounts-header">
        <div>
          <h2>Discount Management</h2>
          <p>Create and manage promotional discounts.</p>
        </div>

        <button
          className="discount-add-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Discount
        </button>
      </div>

      <div className="discount-summary">
        <div className="discount-summary-card">
          <div className="discount-summary-icon">
            <Tag size={22} />
          </div>
          <div>
            <p>Total Discounts</p>
            <h3>{discounts.length}</h3>
          </div>
        </div>

        <div className="discount-summary-card">
          <div className="discount-summary-icon">
            <Tag size={22} />
          </div>
          <div>
            <p>Active Discounts</p>
            <h3>
              {discounts.filter((d) => d.status === "active").length}
            </h3>
          </div>
        </div>

        <div className="discount-summary-card">
          <div className="discount-summary-icon">
            <Tag size={22} />
          </div>
          <div>
            <p>Inactive Discounts</p>
            <h3>
              {discounts.filter((d) => d.status === "inactive").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="discounts-table-card">
        <div className="discounts-toolbar">
          <div className="discount-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="discounts-table-wrapper">
          <table className="discounts-table">
            <thead>
              <tr>
                <th>Discount Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Usage Limit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id}>
                  <td>
                    <strong>{discount.name}</strong>
                  </td>

                  <td>
                    {discount.discount_type === "percentage"
                      ? "Percentage"
                      : "Fixed"}
                  </td>

                  <td>
                    {discount.discount_type === "percentage"
                      ? `${discount.discount_value}%`
                      : `₹${discount.discount_value}`}
                  </td>

                  <td>{discount.start_date}</td>
                  <td>{discount.end_date}</td>
                  <td>{discount.usage_limit}</td>

                  <td>
                    <span
                      className={`discount-status ${discount.status}`}
                    >
                      {discount.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="discount-delete-btn"
                      onClick={() => handleDelete(discount.id)}
                      title="Delete discount"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredDiscounts.length === 0 && (
                <tr>
                  <td colSpan="8" className="discount-empty">
                    No discounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="discount-modal-overlay">
          <div className="discount-modal">
            <div className="discount-modal-header">
              <div>
                <h3>Add New Discount</h3>
                <p>Enter the discount details below.</p>
              </div>

              <button
                className="discount-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDiscount}>
              <div className="discount-form-group">
                <label>Discount Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter discount name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Discount Type</label>
                  <select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleChange}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div className="discount-form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    name="discount_value"
                    placeholder="Enter value"
                    min="0.01"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="discount-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    required
                  />
                </div>
              </div>

              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    name="usage_limit"
                    placeholder="Enter usage limit"
                    min="1"
                    value={formData.usage_limit}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="discount-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="discount-modal-actions">
                <button
                  type="button"
                  className="discount-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="discount-save-btn">
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discounts;