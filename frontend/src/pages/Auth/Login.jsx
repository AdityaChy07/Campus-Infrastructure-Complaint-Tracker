import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await loginUser({
          email,
          password,
        });

      // Save user in Context
login(response.data);

toast.success("Login Successful");

if (response.data.role === "admin") {
  navigate("/dashboard");
} else if (response.data.role === "maintenance") {
  navigate("/maintenance/dashboard");
} else {
  navigate("/dashboard");
}
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="left-side">
          <h1>🏢 JUIT</h1>

          <p>
            Campus Infrastructure
            Complaint Tracker
            <br />
            <br />
            Report and track campus
            infrastructure issues
            efficiently.
          </p>

          <br />
          <br />

          <p>
            Made by Aditya
          </p>
        </div>

        <div className="right-side">
          <h2>
            Welcome Back
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="input-box">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(
                  e
                ) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(
                  e
                ) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? "Logging In..."
                : "Login"}
            </button>
          </form>

          <div className="link">
            Don't have an
            account?

            <Link to="/register">
              {" "}
              Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;