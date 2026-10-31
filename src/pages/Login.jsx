import { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

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

          <form onSubmit={(e) => e.preventDefault()}>

            <label>Email address</label>

            <div className="input-wrapper">
              <Mail size={19} />
              <input
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="password-label">
              <label>Password</label>
              <a href="#forgot-password">Forgot password?</a>
            </div>

            <div className="input-wrapper">
              <LockKeyhole size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <label className="remember-option">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="submit" className="login-button">
              Sign in to your account
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