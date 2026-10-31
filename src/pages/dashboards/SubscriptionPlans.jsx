import { useState } from "react";
import { Plus, Search, Trash2, X, ClipboardList } from "lucide-react";
import "./SubscriptionPlans.css";

function SubscriptionPlans() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic Plan",
      description: "Essential features for individuals",
      price: 499,
      billing_frequency: "monthly",
      minimum_quantity: 1,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      status: "active",
    },
    {
      id: 2,
      name: "Professional Plan",
      description: "Advanced features for professionals",
      price: 999,
      billing_frequency: "monthly",
      minimum_quantity: 1,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      status: "active",
    },
    {
      id: 3,
      name: "Enterprise Plan",
      description: "Complete business solution",
      price: 4999,
      billing_frequency: "yearly",
      minimum_quantity: 5,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      status: "active",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billing_frequency: "monthly",
    minimum_quantity: 1,
    start_date: "",
    end_date: "",
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPlan = (e) => {
    e.preventDefault();

    const newPlan = {
      ...formData,
      id: Date.now(),
      price: Number(formData.price),
      minimum_quantity: Number(formData.minimum_quantity),
    };

    setPlans([...plans, newPlan]);

    setFormData({
      name: "",
      description: "",
      price: "",
      billing_frequency: "monthly",
      minimum_quantity: 1,
      start_date: "",
      end_date: "",
      status: "active",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter((plan) => plan.id !== id));
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="plans-page">

      {/* PAGE HEADER */}
      <div className="plans-heading">
        <div>
          <h2>Subscription Plans</h2>
          <p>Create and manage your subscription plans.</p>
        </div>

        <button
          className="add-plan-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add New Plan
        </button>
      </div>

      {/* SUMMARY */}
      <div className="plans-summary">
        <div className="plans-summary-card">
          <span>Total Plans</span>
          <h2>{plans.length}</h2>
        </div>

        <div className="plans-summary-card">
          <span>Active Plans</span>
          <h2>{plans.filter((plan) => plan.status === "active").length}</h2>
        </div>

        <div className="plans-summary-card">
          <span>Inactive Plans</span>
          <h2>{plans.filter((plan) => plan.status !== "active").length}</h2>
        </div>
      </div>

      {/* PLAN TABLE */}
      <div className="plans-table-container">

        <div className="plans-table-header">
          <div>
            <h3>All Subscription Plans</h3>
            <p>View and manage available plans.</p>
          </div>

          <div className="plans-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="plans-table-wrapper">
          <table className="plans-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Billing</th>
                <th>Minimum Quantity</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <strong>{plan.name}</strong>
                    <small>{plan.description}</small>
                  </td>

                  <td>₹{plan.price.toLocaleString("en-IN")}</td>

                  <td>{plan.billing_frequency}</td>

                  <td>{plan.minimum_quantity}</td>

                  <td>{plan.start_date || "—"}</td>

                  <td>{plan.end_date || "—"}</td>

                  <td>
                    <span className={`plan-status ${plan.status}`}>
                      {plan.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="delete-plan-btn"
                      onClick={() => handleDelete(plan.id)}
                      title="Delete plan"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-plans">
                    No subscription plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PLAN MODAL */}
      {showModal && (
        <div className="plans-modal-overlay">
          <div className="plans-modal">

            <div className="plans-modal-header">
              <div>
                <h3>Add Subscription Plan</h3>
                <p>Enter the details of your new plan.</p>
              </div>

              <button
                className="close-plan-modal"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPlan}>

              <label>Plan Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter plan name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe the plan"
                value={formData.description}
                onChange={handleChange}
              />

              <div className="plans-form-row">
                <div>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Billing Frequency</label>
                  <select
                    name="billing_frequency"
                    value={formData.billing_frequency}
                    onChange={handleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <label>Minimum Quantity</label>
              <input
                type="number"
                name="minimum_quantity"
                min="1"
                value={formData.minimum_quantity}
                onChange={handleChange}
                required
              />

              <div className="plans-form-row">
                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button type="submit" className="save-plan-btn">
                Save Subscription Plan
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SubscriptionPlans;