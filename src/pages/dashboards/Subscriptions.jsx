import { useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import "./Subscriptions.css";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      customer_id: 101,
      plan_id: 1,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      quantity: 1,
      payment_terms: "Monthly",
      status: "active",
    },
    {
      id: 2,
      customer_id: 102,
      plan_id: 2,
      start_date: "2026-02-01",
      end_date: "2027-01-31",
      quantity: 2,
      payment_terms: "Yearly",
      status: "confirmed",
    },
    {
      id: 3,
      customer_id: 103,
      plan_id: 3,
      start_date: "2026-03-01",
      end_date: "2026-09-01",
      quantity: 1,
      payment_terms: "Monthly",
      status: "draft",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    plan_id: "",
    start_date: "",
    end_date: "",
    quantity: 1,
    payment_terms: "Monthly",
    status: "draft",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();

    const newSubscription = {
      ...formData,
      id: Date.now(),
      customer_id: Number(formData.customer_id),
      plan_id: Number(formData.plan_id),
      quantity: Number(formData.quantity),
    };

    setSubscriptions([...subscriptions, newSubscription]);

    setFormData({
      customer_id: "",
      plan_id: "",
      start_date: "",
      end_date: "",
      quantity: 1,
      payment_terms: "Monthly",
      status: "draft",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions(
        subscriptions.filter((subscription) => subscription.id !== id)
      );
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      String(subscription.id).includes(search) ||
      String(subscription.customer_id).includes(search) ||
      String(subscription.plan_id).includes(search);

    const matchesStatus =
      statusFilter === "all" || subscription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="subscriptions-page">

      {/* HEADER */}
      <div className="subscriptions-heading">
        <div>
          <h2>Subscriptions</h2>
          <p>Manage customer subscriptions and their status.</p>
        </div>

        <button
          className="add-subscription-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Subscription
        </button>
      </div>

      {/* SUMMARY */}
      <div className="subscriptions-summary">

        <div className="subscription-summary-card">
          <span>Total Subscriptions</span>
          <h2>{subscriptions.length}</h2>
        </div>

        <div className="subscription-summary-card">
          <span>Active</span>
          <h2>
            {subscriptions.filter((s) => s.status === "active").length}
          </h2>
        </div>

        <div className="subscription-summary-card">
          <span>Confirmed</span>
          <h2>
            {subscriptions.filter((s) => s.status === "confirmed").length}
          </h2>
        </div>

        <div className="subscription-summary-card">
          <span>Draft</span>
          <h2>
            {subscriptions.filter((s) => s.status === "draft").length}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="subscriptions-table-container">

        <div className="subscriptions-table-header">
          <div>
            <h3>All Subscriptions</h3>
            <p>View and manage customer subscriptions.</p>
          </div>

          <div className="subscription-filters">

            <div className="subscription-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search ID, customer or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="quotation">Quotation</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>

          </div>
        </div>

        <div className="subscriptions-table-wrapper">
          <table className="subscriptions-table">

            <thead>
              <tr>
                <th>Subscription ID</th>
                <th>Customer ID</th>
                <th>Plan ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Quantity</th>
                <th>Payment Terms</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id}>

                  <td>SUB-{subscription.id}</td>

                  <td>{subscription.customer_id}</td>

                  <td>{subscription.plan_id}</td>

                  <td>{subscription.start_date}</td>

                  <td>{subscription.end_date || "—"}</td>

                  <td>{subscription.quantity}</td>

                  <td>{subscription.payment_terms}</td>

                  <td>
                    <span
                      className={`subscription-status ${subscription.status}`}
                    >
                      {subscription.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="delete-subscription-btn"
                      onClick={() => handleDelete(subscription.id)}
                      title="Delete subscription"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td colSpan="9" className="no-subscriptions">
                    No subscriptions found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SUBSCRIPTION MODAL */}
      {showModal && (
        <div className="subscription-modal-overlay">

          <div className="subscription-modal">

            <div className="subscription-modal-header">
              <div>
                <h3>Add Subscription</h3>
                <p>Enter the subscription details below.</p>
              </div>

              <button
                className="close-subscription-modal"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubscription}>

              <div className="subscription-form-row">

                <div>
                  <label>Customer ID</label>
                  <input
                    type="number"
                    name="customer_id"
                    min="1"
                    placeholder="Enter customer ID"
                    value={formData.customer_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Plan ID</label>
                  <input
                    type="number"
                    name="plan_id"
                    min="1"
                    placeholder="Enter plan ID"
                    value={formData.plan_id}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="subscription-form-row">

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
                  />
                </div>

              </div>

              <div className="subscription-form-row">

                <div>
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Payment Terms</label>
                  <select
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

              </div>

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="quotation">Quotation</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>

              <button type="submit" className="save-subscription-btn">
                Save Subscription
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Subscriptions;