import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check login response
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Check user details
      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Invalid login response from server");
      }

      // Save token and user information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate according to user role
      if (data.user.role === "admin") {
        navigate("/admin");
      }
      else if (data.user.role === "staff") {
        navigate("/staff");
      }
      else if (data.user.role === "customer") {
        navigate("/customer");
      }
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error("Invalid user role");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT BRANDING SECTION */}
      <section className="login-left">

        <div className="brand">
          <div className="brand-icon">b</div>
          <span className="brand-name">
            bright<span>loop</span>
          </span>
        </div>

        <div className="hero-content">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            SMARTER BUSINESS MANAGEMENT
          </div>

          <h1>
            Your business.
            <br />
            Your subscriptions.
            <br />
            <span>One platform.</span>
          </h1>

          <p className="hero-description">
            Take control of recurring revenue, simplify billing
            and build stronger customer relationships with
            one powerful platform.
          </p>

          <div className="feature-list">

            <div>
              <CheckCircle2 />
              Automated recurring billing
            </div>

            <div>
              <CheckCircle2 />
              Complete subscription tracking
            </div>

            <div>
              <CheckCircle2 />
              Real-time business insights
            </div>

          </div>
        </div>

        <div className="left-bottom">
          <ShieldCheck size={17} />
          <span>Built for smarter business operations</span>
        </div>

        <div className="glow-circle"></div>

      </section>


      {/* RIGHT LOGIN SECTION */}
      <section className="login-right">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-icon">B</div>
            <span>brightloop</span>
          </div>

          <div className="login-heading">

            <div className="welcome-badge">WELCOME BACK</div>

            <h2>Sign in to Brightloop</h2>

            <p>
              Enter your credentials to access your workspace.
            </p>

          </div>


          {/* ERROR MESSAGE */}
          {error && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "15px",
                fontWeight: "600"
              }}
            >
              {error}
            </div>
          )}


          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            <label>Email address</label>

            <div className="input-wrapper">

              <Mail size={19} />

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <div className="password-label">

              <label>Password</label>

              <a href="#forgot-password">
                Forgot password?
              </a>

            </div>


            <div className="input-wrapper">

              <LockKeyhole size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>


            <label className="remember-option">

              <input type="checkbox" />

              <span>Remember me</span>

            </label>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? "Signing in..." : "Sign in to your account"}

              <ArrowRight size={19} />

            </button>

          </form>


          <div className="login-divider">

            <span></span>

            <p>SECURE ACCESS</p>

            <span></span>

          </div>


          <div className="security-note">

            <ShieldCheck size={17} />

            Your account information is protected.

          </div>

        </div>


        <footer className="right-footer">
          © 2026 Brightloop Software. All rights reserved.
        </footer>

      </section>

    </div>
  );
}

export default Login;
