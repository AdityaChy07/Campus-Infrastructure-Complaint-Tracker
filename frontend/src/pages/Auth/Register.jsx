import { Link, useNavigate }
from "react-router-dom";

import { useState }
from "react";

import {
  registerUser,
} from "../../services/authService";

import {
  toast,
} from "react-toastify";

function Register() {
  const navigate =
    useNavigate();

  const [form,
    setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "student",
      department: "",
    });

  const [loading,
    setLoading] =
    useState(false);

  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await registerUser(
          form
        );

        toast.success(
          "Registration Successful"
        );

        navigate(
          "/login"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Registration Failed"
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
            Create your account and
            start reporting campus
            infrastructure issues.
          </p>
        </div>

        <div className="right-side">

          <h2>
            Create Account
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="input-box">
              <input
                name="name"
                placeholder="Full Name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="input-box">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="input-box">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="input-box">
              <select
                name="role"
                value={
                  form.role
                }
                onChange={
                  handleChange
                }
              >
                <option value="student">
                  Student
                </option>

                <option value="faculty">
                  Faculty
                </option>
              </select>
            </div>

            <div className="input-box">
              <input
                name="department"
                placeholder="Department"
                value={
                  form.department
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? "Registering..."
                : "Register"}
            </button>

          </form>

          <div className="link">
            Already have an
            account?

            <Link to="/login">
              {" "}
              Login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;