import {
  LayoutDashboard,
  Repeat,
  FileText,
  CreditCard,
  User,
  LogOut,
  Bell
} from "lucide-react";

import "./CustomerDashboard.css";

function CustomerDashboard() {
  return (
    <div className="customer-dashboard">
      <aside className="customer-sidebar">
        <h2>bright<span>loop</span></h2>

        <p className="customer-menu-title">MY ACCOUNT</p>

        <button className="customer-nav active">
          <LayoutDashboard size={19} /> Overview
        </button>

        <button className="customer-nav">
          <Repeat size={19} /> My Subscriptions
        </button>

        <button className="customer-nav">
          <FileText size={19} /> My Invoices
        </button>

        <button className="customer-nav">
          <CreditCard size={19} /> My Payments
        </button>

        <button className="customer-nav">
          <User size={19} /> My Profile
        </button>

        <button className="customer-nav customer-logout">
          <LogOut size={19} /> Logout
        </button>
      </aside>

      <main className="customer-main">
        <header className="customer-header">
          <div>
            <h2>My Dashboard</h2>
            <p>Manage your subscriptions and account.</p>
          </div>

          <div className="customer-user">
            <Bell size={20} />
            <div className="customer-avatar">C</div>
            <span>Customer</span>
          </div>
        </header>

        <section className="customer-welcome">
          <h1>Welcome back! 👋</h1>
          <p>Here's an overview of your account.</p>
        </section>

        <section className="customer-stats">
          <div className="customer-card">
            <p>My Subscriptions</p>
            <h2>--</h2>
          </div>

          <div className="customer-card">
            <p>Active Subscriptions</p>
            <h2>--</h2>
          </div>

          <div className="customer-card">
            <p>Pending Invoices</p>
            <h2>--</h2>
          </div>

          <div className="customer-card">
            <p>Total Payments</p>
            <h2>--</h2>
          </div>
        </section>

        <section className="customer-content">
          <h3>My Subscriptions</h3>
          <p>Your subscription details will appear here.</p>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;