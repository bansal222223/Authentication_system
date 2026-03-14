import { useState, useEffect, useRef } from "react";

const API = "/api/auth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --border: #1e1e2e;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --success: #43e97b;
    --error: #ff4d6d;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .page::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(108,99,255,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 90%, rgba(255,101,132,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 460px;
    padding: 20px;
    animation: fadeUp 0.5s ease;
  }

  .logo {
    text-align: center;
    margin-bottom: 32px;
  }

  .logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 16px;
    margin-bottom: 12px;
    font-size: 24px;
  }

  .logo h1 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  .logo h1 span { color: var(--accent); }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 36px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }

  .tabs {
    display: flex;
    gap: 4px;
    background: var(--bg);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab.active { background: var(--accent); color: white; }

  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text);
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 24px;
  }

  .field { margin-bottom: 16px; }

  .field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .field input, .field select {
    width: 100%;
    padding: 13px 16px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;
  }

  .field input:focus, .field select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
  }

  .otp-container {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 8px;
  }

  .otp-input {
    width: 50px !important;
    height: 56px;
    text-align: center;
    font-size: 22px !important;
    font-weight: 700;
    font-family: 'Syne', sans-serif !important;
    padding: 0 !important;
  }

  .btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--accent), #8b7cf6);
    border: none;
    border-radius: 12px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }

  .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(108,99,255,0.4); }
  .btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .alert {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeUp 0.3s ease;
  }

  .alert-success { background: rgba(67,233,123,0.1); border: 1px solid rgba(67,233,123,0.3); color: var(--success); }
  .alert-error { background: rgba(255,77,109,0.1); border: 1px solid rgba(255,77,109,0.3); color: var(--error); }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: var(--muted); font-size: 13px;
  }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .link-btn {
    background: none; border: none; color: var(--accent);
    font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: underline; text-underline-offset: 3px;
  }

  .token-box {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; position: relative;
  }

  .token-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
    color: var(--accent); font-weight: 600; margin-bottom: 4px;
  }

  .token-value {
    font-size: 12px; color: var(--muted); word-break: break-all;
    font-family: monospace; line-height: 1.5;
  }

  .copy-btn {
    position: absolute; top: 10px; right: 10px;
    background: var(--border); border: none; border-radius: 6px;
    color: var(--muted); font-size: 12px; padding: 4px 8px;
    cursor: pointer; transition: all 0.2s;
  }

  .copy-btn:hover { background: var(--accent); color: white; }

  .role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.3); border-radius: 100px;
    font-size: 13px; font-weight: 600; color: var(--accent); margin-bottom: 20px;
  }

  .timer-text { font-size: 13px; color: var(--muted); text-align: center; margin-top: 12px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

function OTPInput({ otp, setOtp }) {
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-container">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          className="field input otp-input"
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}

function RegisterForm({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [otpType, setOtpType] = useState("numeric")
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !role) {
      setAlert({ type: "error", message: "Please fill in all required fields." });
      return;
    }
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const res = await fetch(`${API}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message || "OTP sent successfully!" });
        setTimeout(() => onSuccess(email), 1500);
      } else {
        const errMsg = Object.values(data).flat().join(" ");
        setAlert({ type: "error", message: errMsg || "Registration failed." });
      }
    } catch {
      setAlert({ type: "error", message: "Unable to connect to the server." });
    }
    setLoading(false);
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="form-title">Create Account</div>
      <div className="form-subtitle">Join us to start your secure journey</div>
      <Alert type={alert.type} message={alert.message} />
      <div className="field">
        <label>Email Address</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="field">
        <label>Account Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Choose your role --</option>
          <option value="client">👤 Client</option>
          <option value="reseller">🏪 Reseller</option>
          <option value="superadmin">👑 SuperAdmin</option>
        </select>
      </div>
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending OTP..." : "Register & Get OTP →"}
      </button>
      <div className="divider">OR</div>
      <div style={{ textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
        Already registered? <button className="link-btn" onClick={onSwitch}>Login here</button>
      </div>
    </div>
  );
}

function VerifyForm({ prefillEmail, onSuccess, onResend }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (!email || otpString.length < 6) {
      setAlert({ type: "error", message: "Please enter email and a valid 6-digit OTP." });
      return;
    }
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const res = await fetch(`${API}/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message || "Email verified successfully!" });
        setTimeout(() => onSuccess(email), 1500);
      } else {
        setAlert({ type: "error", message: data.error || "Verification failed." });
      }
    } catch {
      setAlert({ type: "error", message: "Could not connect to the server." });
    }
    setLoading(false);
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="form-title">Verify OTP</div>
      <div className="form-subtitle">Enter the verification code sent to your email</div>
      <Alert type={alert.type} message={alert.message} />
      <div className="field">
        <label>Email Address</label>
        <input type="email" placeholder="registered@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>6-Digit Code</label>
        <OTPInput otp={otp} setOtp={setOtp} />
      </div>
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Verifying..." : "Verify Code →"}
      </button>
      <div className="timer-text">
        {timer > 0 ? (
          `Resend OTP in ${timer}s`
        ) : (
          <button className="link-btn" onClick={() => { setTimer(30); onResend(); }}>Resend Code</button>
        )}
      </div>
    </div>
  );
}

function LoginForm({ prefillEmail, onSuccess, onSwitch }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({ type: "error", message: "Email and password are required." });
      return;
    }
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const res = await fetch(`${API}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        onSuccess(data);
      } else {
        setAlert({ type: "error", message: data.error || "Login failed. Check credentials." });
      }
    } catch {
      setAlert({ type: "error", message: "Unable to reach server." });
    }
    setLoading(false);
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="form-title">Welcome Back</div>
      <div className="form-subtitle">Log in to manage your secure dashboard</div>
      <Alert type={alert.type} message={alert.message} />
      <div className="field">
        <label>Email Address</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Authenticating..." : "Login & Get Token →"}
      </button>
      <div className="divider">OR</div>
      <div style={{ textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
        Need an account? <button className="link-btn" onClick={onSwitch}>Register now</button>
      </div>
    </div>
  );
}

function SuccessScreen({ data, onLogout }) {
  const roleEmoji = { client: "👤", reseller: "🏪", superadmin: "👑" };

  const copyToken = (text, id) => {
    navigator.clipboard.writeText(text);
    const btn = document.getElementById(id);
    const oldText = btn.textContent;
    btn.textContent = "Copied!";
    btn.style.background = "var(--success)";
    btn.style.color = "var(--bg)";
    setTimeout(() => { btn.textContent = oldText; btn.style = ""; }, 2000);
  };

  return (
    <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease" }}>
      <div className="success-icon">✓</div>
      <div className="form-title" style={{ marginBottom: 8 }}>Login Successful! 🎉</div>
      <div className="form-subtitle" style={{ marginBottom: 16 }}>Your session is now active</div>
      <div className="role-badge">
        {roleEmoji[data.role] || "👤"} <span>{data.role}</span>
      </div>
      <div className="token-box">
        <div className="token-label">Access Token</div>
        <div className="token-value">{data.access}</div>
        <button id="copy-access" className="copy-btn" onClick={() => copyToken(data.access, "copy-access")}>Copy</button>
      </div>
      <div className="token-box">
        <div className="token-label">Refresh Token</div>
        <div className="token-value">{data.refresh}</div>
        <button id="copy-refresh" className="copy-btn" onClick={() => copyToken(data.refresh, "copy-refresh")}>Copy</button>
      </div>
      <button className="btn" style={{ marginTop: 20 }} onClick={onLogout}>Logout Session</button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [loginData, setLoginData] = useState(null);

  const tabs = ["register", "verify", "login"];
  const tabLabels = { register: "Register", verify: "Verify", login: "Login" };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoginData(null);
    setActiveTab("login");
  };

  return (
    <div className="page">
      <style>{styles}</style>
      <div className="grid-bg" />
      <div className="container">
        <div className="logo">
          <div className="logo-icon">🔐</div>
          <h1>Auth<span>Protocol</span></h1>
        </div>
        <div className="card">
          {loginData ? (
            <SuccessScreen data={loginData} onLogout={handleLogout} />
          ) : (
            <>
              <div className="tabs">
                {tabs.map((tab) => (
                  <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>
              {activeTab === "register" && (
                <RegisterForm 
                  onSuccess={(email) => { setPrefillEmail(email); setActiveTab("verify"); }} 
                  onSwitch={() => setActiveTab("login")}
                />
              )}
              {activeTab === "verify" && (
                <VerifyForm 
                  prefillEmail={prefillEmail} 
                  onSuccess={(email) => { setPrefillEmail(email); setActiveTab("login"); }} 
                  onResend={() => console.log("OTP Resent Requested")}
                />
              )}
              {activeTab === "login" && (
                <LoginForm 
                  prefillEmail={prefillEmail} 
                  onSuccess={(data) => setLoginData(data)} 
                  onSwitch={() => setActiveTab("register")}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}