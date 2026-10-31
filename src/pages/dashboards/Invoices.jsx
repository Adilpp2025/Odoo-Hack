import { useState } from "react";
import { Search, Plus, Trash2, X, FileText } from "lucide-react";
import "./Invoices.css";

function Invoices() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      subscription_id: 101,
      customer_id: 201,
      invoice_date: "2026-10-01",
      due_date: "2026-10-15",
      subtotal: 2000,
      tax: 360,
      total: 2360,
      status: "confirmed",
    },
    {
      id: 2,
      subscription_id: 102,
      customer_id: 202,
      invoice_date: "2026-10-05",
      due_date: "2026-10-20",
      subtotal: 3000,
      tax: 540,
      total: 3540,
      status: "paid",
    },
    {
      id: 3,
      subscription_id: 103,
      customer_id: 203,
      invoice_date: "2026-10-10",
      due_date: "2026-10-25",
      subtotal: 1500,
      tax: 270,
      total: 1770,
      status: "draft",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    subscription_id: "",
    customer_id: "",
    invoice_date: "",
    due_date: "",
    subtotal: "",
    tax: "",
    status: "draft",
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      String(invoice.id).includes(search) ||
      String(invoice.customer_id).includes(search) ||
      String(invoice.subscription_id).includes(search);

    const matchesStatus =
      filterStatus === "All" || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subtotal = Number(formData.subtotal);
    const tax = Number(formData.tax);

    const newInvoice = {
      ...formData,
      id: Date.now(),
      subscription_id: Number(formData.subscription_id),
      customer_id: Number(formData.customer_id),
      subtotal,
      tax,
      total: subtotal + tax,
    };

    setInvoices([...invoices, newInvoice]);
    setShowModal(false);

    setFormData({
      subscription_id: "",
      customer_id: "",
      invoice_date: "",
      due_date: "",
      subtotal: "",
      tax: "",
      status: "draft",
    });
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  return (
    <div className="invoices-page">

      <div className="invoices-heading">
        <div>
          <h2>Invoices</h2>
          <p>Create and manage customer invoices.</p>
        </div>

        <button
          className="add-invoice-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="invoice-summary">
        <div className="invoice-summary-card">
          <span>Total Invoices</span>
          <h3>{invoices.length}</h3>
        </div>

        <div className="invoice-summary-card">
          <span>Paid Invoices</span>
          <h3>{invoices.filter((i) => i.status === "paid").length}</h3>
        </div>

        <div className="invoice-summary-card">
          <span>Pending Invoices</span>
          <h3>
            {invoices.filter(
              (i) => i.status === "confirmed"
            ).length}
          </h3>
        </div>

        <div className="invoice-summary-card">
          <span>Total Amount</span>
          <h3>
            {formatCurrency(
              invoices.reduce((sum, i) => sum + Number(i.total), 0)
            )}
          </h3>
        </div>
      </div>

      <div className="invoice-table-card">

        <div className="invoice-toolbar">
          <div className="invoice-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search invoice, customer or subscription..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer ID</th>
                <th>Subscription ID</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>INV-{invoice.id}</td>
                    <td>{invoice.customer_id}</td>
                    <td>{invoice.subscription_id}</td>
                    <td>{invoice.invoice_date}</td>
                    <td>{invoice.due_date}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>
                      <span className={`invoice-status ${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-invoice-btn"
                        onClick={() => deleteInvoice(invoice.id)}
                        title="Delete invoice"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="invoice-empty">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {showModal && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal">

            <div className="invoice-modal-heading">
              <div>
                <h2>Create Invoice</h2>
                <p>Enter the invoice details below.</p>
              </div>

              <button onClick={() => setShowModal(false)}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="invoice-form-grid">

                <div className="invoice-form-group">
                  <label>Subscription ID</label>
                  <input
                    type="number"
                    name="subscription_id"
                    value={formData.subscription_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Invoice Date</label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Subtotal (₹)</label>
                  <input
                    type="number"
                    name="subtotal"
                    min="0"
                    step="0.01"
                    value={formData.subtotal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group">
                  <label>Tax (₹)</label>
                  <input
                    type="number"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={formData.tax}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="invoice-form-group full-width">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

              </div>

              <div className="invoice-modal-actions">
                <button
                  type="button"
                  className="invoice-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="invoice-save-btn">
                  Create Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Invoices;