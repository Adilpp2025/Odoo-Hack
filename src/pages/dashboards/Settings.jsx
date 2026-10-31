import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Building2,
  Save,
} from "lucide-react";
import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    companyName: "Brightloop Software",
    companyEmail: "admin@brightloop.com",
    phone: "",
    notifications: true,
    emailAlerts: true,
    twoFactor: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <h2>System Settings</h2>
          <p>Manage your company information and preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <section className="settings-card">
          <div className="settings-card-heading">
            <Building2 size={21} />
            <div>
              <h3>Company Information</h3>
              <p>Update your basic company details.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label>
              Company Name
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
              />
            </label>

            <label>
              Company Email
              <input
                type="email"
                name="companyEmail"
                value={settings.companyEmail}
                onChange={handleChange}
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <Bell size={21} />
            <div>
              <h3>Notifications</h3>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <label className="settings-toggle">
            <div>
              <strong>System Notifications</strong>
              <p>Receive notifications about system activities.</p>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
          </label>

          <label className="settings-toggle">
            <div>
              <strong>Email Alerts</strong>
              <p>Receive important updates through email.</p>
            </div>
            <input
              type="checkbox"
              name="emailAlerts"
              checked={settings.emailAlerts}
              onChange={handleChange}
            />
          </label>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <Shield size={21} />
            <div>
              <h3>Security</h3>
              <p>Manage your account security preferences.</p>
            </div>
          </div>

          <label className="settings-toggle">
            <div>
              <strong>Two-Factor Authentication</strong>
              <p>Add an extra layer of security to your account.</p>
            </div>
            <input
              type="checkbox"
              name="twoFactor"
              checked={settings.twoFactor}
              onChange={handleChange}
            />
          </label>
        </section>

        <div className="settings-footer">
          {saved && (
            <span className="settings-success">
              Settings saved successfully!
            </span>
          )}

          <button type="submit" className="settings-save-button">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;