import { useState } from "react";
import { Search, Plus, Trash2, X, CreditCard } from "lucide-react";
import "./Payments.css";

function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      invoice_id: 1,
      customer_id: 201,
      amount: 2360,
      payment_date: "2026-10-10",
      payment_method: "UPI",
      note: "October subscription payment",
    },
    {
      id: 2,
      invoice_id: 2,
      customer_id: 202,
      amount: 3540,
      payment_date: "2026-10-12",
      payment_method: "Credit Card",
      note: "Professional plan payment",
    },
    {
      id: 3,
      invoice_id: 3,
      customer_id: 203,
      amount: 1770,
      payment_date: "2026-10-15",
      payment_method: "Bank Transfer",
      note: "Monthly plan payment",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    invoice_id: "",
    customer_id: "",
    amount: "",
    payment_date: "",
    payment_method: "UPI",
    note: "",
  });

  const filteredPayments = payments.filter((payment) =>
    String(payment.id).includes(search) ||
    String(payment.invoice_id).includes(search) ||
    String(payment.customer_id).includes(search) ||
    payment.payment_method.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPayment = {
      ...formData,
      id: Date.now(),
      invoice_id: Number(formData.invoice_id),
      customer_id: Number(formData.customer_id),
      amount: Number(formData.amount),
    };

    setPayments([...payments, newPayment]);
    setShowModal(false);

    setFormData({
      invoice_id: "",
      customer_id: "",
      amount: "",
      payment_date: "",
      payment_method: "UPI",
      note: "",
    });
  };

  const deletePayment = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const totalPayments = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  return (
    <div className="payments-page">

      <div className="payments-heading">
        <div>
          <h2>Payments</h2>
          <p>Track and manage customer payments.</p>
        </div>

        <button
          className="add-payment-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {/* SUMMARY */}
      <div className="payment-summary">

        <div className="payment-summary-card">
          <span>Total Payments</span>
          <h3>{payments.length}</h3>
        </div>

        <div className="payment-summary-card">
          <span>Total Amount Received</span>
          <h3>{formatCurrency(totalPayments)}</h3>
        </div>

        <div className="payment-summary-card">
          <span>UPI Payments</span>
          <h3>
            {payments.filter((p) => p.payment_method === "UPI").length}
          </h3>
        </div>

        <div className="payment-summary-card">
          <span>Card Payments</span>
          <h3>
            {payments.filter((p) =>
              p.payment_method.toLowerCase().includes("card")
            ).length}
          </h3>
        </div>

      </div>

      {/* PAYMENT TABLE */}
      <div className="payment-table-card">

        <div className="payment-toolbar">
          <div className="payment-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search payment, invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="payment-table-wrapper">
          <table className="payment-table">

            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Invoice ID</th>
                <th>Customer ID</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>PAY-{payment.id}</td>
                    <td>{payment.invoice_id}</td>
                    <td>{payment.customer_id}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{payment.payment_date}</td>
                    <td>
                      <span className="payment-method">
                        {payment.payment_method}
                      </span>
                    </td>
                    <td>{payment.note || "-"}</td>
                    <td>
                      <button
                        className="delete-payment-btn"
                        onClick={() => deletePayment(payment.id)}
                        title="Delete payment"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="payment-empty">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* ADD PAYMENT MODAL */}
      {showModal && (
        <div className="payment-modal-overlay">

          <div className="payment-modal">

            <div className="payment-modal-heading">
              <div>
                <h2>Record Payment</h2>
                <p>Enter the payment details below.</p>
              </div>

              <button onClick={() => setShowModal(false)}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="payment-form-grid">

                <div className="payment-form-group">
                  <label>Invoice ID</label>
                  <input
                    type="number"
                    name="invoice_id"
                    value={formData.invoice_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="payment-form-group">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="payment-form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="payment-form-group">
                  <label>Payment Date</label>
                  <input
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="payment-form-group full-width">
                  <label>Payment Method</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="payment-form-group full-width">
                  <label>Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Enter payment note..."
                    rows="3"
                  />
                </div>

              </div>

              <div className="payment-modal-actions">

                <button
                  type="button"
                  className="payment-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="payment-save-btn">
                  Record Payment
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Payments;