import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Repeat,
  FileText,
  CreditCard,
  Tags,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

import UsersPage from "./Users";
import ProductsPage from "./Products";
import SubscriptionPlans from "./SubscriptionPlans";
import Subscriptions from "./Subscriptions";
import Invoices from "./Invoices";
import Payments from "./Payments";
import Discounts from "./Discounts";
import Reports from "./Reports";
import Settings from "./Settings";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      heading: "MAIN MENU",
      items: [{ name: "Overview", icon: LayoutDashboard }],
    },
    {
      heading: "MANAGEMENT",
      items: [
        { name: "Users", icon: Users },
        { name: "Products", icon: Package },
        { name: "Subscription Plans", icon: ClipboardList },
        { name: "Subscriptions", icon: Repeat },
        { name: "Invoices", icon: FileText },
        { name: "Payments", icon: CreditCard },
        { name: "Discounts", icon: Tags },
      ],
    },
    {
      heading: "ANALYTICS",
      items: [{ name: "Reports", icon: BarChart3 }],
    },
    {
      heading: "SETTINGS",
      items: [{ name: "Settings", icon: SettingsIcon }],
    },
  ];

  const stats = [
    { title: "Total Customers", value: "1,248", change: "+12.5%" },
    { title: "Active Subscriptions", value: "856", change: "+8.2%" },
    { title: "Total Revenue", value: "₹4,82,500", change: "+15.3%" },
    { title: "Pending Invoices", value: "32", change: "-4.5%" },
  ];

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="admin-logo">
          <span className="logo-icon">b</span>
          bright<span>loop</span>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {navigation.map((group) => (
          <div key={group.heading}>
            <p className="sidebar-heading">{group.heading}</p>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`sidebar-link ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => {
                    setActivePage(item.name);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        ))}

        <button className="sidebar-link logout-link">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h2>{activePage}</h2>
              <p>Manage your business from one place.</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="search-button">
              <Search size={19} />
            </button>

            <button className="notification-button">
              <Bell size={19} />
              <span></span>
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">A</div>

              <div className="admin-profile-info">
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER AND STATISTICS */}
        {activePage === "Overview" && (
          <>
            <section className="admin-welcome">
              <div>
                <p className="welcome-label">ADMINISTRATOR WORKSPACE</p>
                <h1>Welcome back, Admin! 👋</h1>
                <p>
                  Here's what's happening with your subscription business
                  today.
                </p>
              </div>
            </section>

            <section className="admin-stats">
              {stats.map((stat) => (
                <div className="admin-stat-card" key={stat.title}>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                  <span className="stat-change">
                    {stat.change} from last month
                  </span>
                </div>
              ))}
            </section>
          </>
        )}

        {/* CONTENT SECTION */}
        {activePage === "Users" ? (
          <UsersPage />
        ) : activePage === "Products" ? (
          <ProductsPage />
        ) : activePage === "Subscription Plans" ? (
          <SubscriptionPlans />
        ) : activePage === "Subscriptions" ? (
          <Subscriptions />
        ) : activePage === "Invoices" ? (
          <Invoices />
        ) : activePage === "Payments" ? (
          <Payments />
        ) : activePage === "Discounts" ? (
          <Discounts />
        ) : activePage === "Reports" ? (
          <Reports />
        ) : activePage === "Settings" ? (
          <Settings />
        ) : activePage === "Overview" ? (
          <section className="admin-section">
            <div className="section-header">
              <div>
                <h3>Business Overview</h3>
                <p>
                  Welcome to the Brightloop subscription management system.
                </p>
              </div>
            </div>

            <div className="dashboard-placeholder">
              <BarChart3 size={35} />
              <h3>Dashboard Overview</h3>
              <p>Your business information will appear here.</p>
            </div>
          </section>
        ) : (
          <section className="admin-section">
            <div className="section-header">
              <div>
                <h3>{activePage} Overview</h3>
                <p>Manage your {activePage.toLowerCase()} here.</p>
              </div>
            </div>

            <div className="dashboard-placeholder">
              <BarChart3 size={35} />
              <h3>{activePage}</h3>
              <p>
                Your {activePage.toLowerCase()} information will appear here.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;