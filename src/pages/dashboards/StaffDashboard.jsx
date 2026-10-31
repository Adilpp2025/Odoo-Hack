import {
  LayoutDashboard,
  Users,
  Repeat,
  FileText,
  CreditCard,
  LogOut,
  Bell
} from "lucide-react";

import "./StaffDashboard.css";

function StaffDashboard() {
  return (
    <div className="staff-dashboard">
      <aside className="staff-sidebar">
        <h2>bright<span>loop</span></h2>

        <p className="staff-menu-title">WORKSPACE</p>

        <button className="staff-nav active">
          <LayoutDashboard size={19} /> Overview
        </button>

        <button className="staff-nav">
          <Users size={19} /> Customers
        </button>

        <button className="staff-nav">
          <Repeat size={19} /> Subscriptions
        </button>

        <button className="staff-nav">
          <FileText size={19} /> Invoices
        </button>

        <button className="staff-nav">
          <CreditCard size={19} /> Payments
        </button>

        <button className="staff-nav staff-logout">
          <LogOut size={19} /> Logout
        </button>
      </aside>

      <main className="staff-main">
        <header className="staff-header">
          <div>
            <h2>Staff Dashboard</h2>
            <p>Manage your assigned tasks and customers.</p>
          </div>

          <div className="staff-user">
            <Bell size={20} />
            <div className="staff-avatar">S</div>
            <span>Staff Member</span>
          </div>
        </header>

        <section className="staff-welcome">
          <h1>Welcome back! 👋</h1>
          <p>Here's your workspace overview for today.</p>
        </section>

        <section className="staff-stats">
          <div className="staff-card">
            <p>Assigned Customers</p>
            <h2>--</h2>
          </div>

          <div className="staff-card">
            <p>Active Subscriptions</p>
            <h2>--</h2>
          </div>

          <div className="staff-card">
            <p>Pending Invoices</p>
            <h2>--</h2>
          </div>

          <div className="staff-card">
            <p>Payments Processed</p>
            <h2>--</h2>
          </div>
        </section>

        <section className="staff-content">
          <h3>My Workspace</h3>
          <p>Your assigned customers and activities will appear here.</p>
        </section>
      </main>
    </div>
  );
}

export default StaffDashboard;