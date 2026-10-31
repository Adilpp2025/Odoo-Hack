import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  TrendingUp,
  IndianRupee,
  Users,
  Repeat,
  Download,
} from "lucide-react";

import "./Reports.css";

function Reports() {
  const revenueData = [
    { month: "Jan", revenue: 25000 },
    { month: "Feb", revenue: 32000 },
    { month: "Mar", revenue: 28000 },
    { month: "Apr", revenue: 42000 },
    { month: "May", revenue: 38000 },
    { month: "Jun", revenue: 50000 },
    { month: "Jul", revenue: 47000 },
    { month: "Aug", revenue: 62000 },
    { month: "Sep", revenue: 55000 },
    { month: "Oct", revenue: 72000 },
  ];

  const subscriptionData = [
    { name: "Active", value: 856 },
    { name: "Confirmed", value: 120 },
    { name: "Draft", value: 45 },
    { name: "Closed", value: 80 },
  ];

  const invoiceData = [
    { name: "Paid", value: 720 },
    { name: "Confirmed", value: 150 },
    { name: "Draft", value: 65 },
    { name: "Cancelled", value: 25 },
  ];

  const COLORS = ["#7865e8", "#36b58a", "#f4b740", "#ef7272"];

  const payments = [
    {
      id: "PAY-1001",
      customer: "John Mathew",
      amount: 2500,
      date: "2026-10-28",
      method: "UPI",
    },
    {
      id: "PAY-1002",
      customer: "Sarah Thomas",
      amount: 4500,
      date: "2026-10-27",
      method: "Credit Card",
    },
    {
      id: "PAY-1003",
      customer: "Alex Joseph",
      amount: 1800,
      date: "2026-10-26",
      method: "Bank Transfer",
    },
  ];

  const handleExport = () => {
    const rows = [
      ["Payment ID", "Customer", "Amount", "Date", "Payment Method"],
      ...payments.map((payment) => [
        payment.id,
        payment.customer,
        payment.amount,
        payment.date,
        payment.method,
      ]),
    ];

    const csvContent = rows
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "brightloop-payment-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      {/* HEADER */}
      <div className="reports-header">
        <div>
          <h2>Business Reports</h2>
          <p>Track revenue, subscriptions and payment performance.</p>
        </div>

        <button className="report-export-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="report-stats">
        <div className="report-stat-card">
          <div className="report-stat-icon purple">
            <IndianRupee size={22} />
          </div>
          <div>
            <p>Total Revenue</p>
            <h3>₹4,82,500</h3>
            <span className="report-positive">
              <TrendingUp size={14} /> +15.3% from last month
            </span>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon green">
            <Repeat size={22} />
          </div>
          <div>
            <p>Active Subscriptions</p>
            <h3>856</h3>
            <span className="report-positive">
              <TrendingUp size={14} /> +8.2% from last month
            </span>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon orange">
            <Users size={22} />
          </div>
          <div>
            <p>Total Customers</p>
            <h3>1,248</h3>
            <span className="report-positive">
              <TrendingUp size={14} /> +12.5% from last month
            </span>
          </div>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="report-chart-card">
        <div className="report-card-header">
          <div>
            <h3>Revenue Overview</h3>
            <p>Monthly revenue performance</p>
          </div>
          <span className="report-period">January - October 2026</span>
        </div>

        <div className="revenue-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#7865e8"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7865e8"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7865e8"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BREAKDOWN CHARTS */}
      <div className="report-breakdown">
        <div className="report-chart-card">
          <div className="report-card-header">
            <div>
              <h3>Subscription Breakdown</h3>
              <p>Subscriptions by status</p>
            </div>
          </div>

          <div className="pie-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={4}
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-chart-card">
          <div className="report-card-header">
            <div>
              <h3>Invoice Breakdown</h3>
              <p>Invoices by status</p>
            </div>
          </div>

          <div className="pie-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={4}
                >
                  {invoiceData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <div className="report-chart-card recent-payments-card">
        <div className="report-card-header">
          <div>
            <h3>Recent Payments</h3>
            <p>Latest payment transactions</p>
          </div>
        </div>

        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>{payment.id}</strong>
                  </td>
                  <td>{payment.customer}</td>
                  <td>₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td>{payment.date}</td>
                  <td>{payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
