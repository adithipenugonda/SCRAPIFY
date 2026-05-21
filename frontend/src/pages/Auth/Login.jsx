import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import useAuth from "../../hooks/useAuth";

import "./Auth.css";


const Login = () => {

  const navigate = useNavigate();

  const {
    login,
  } = useAuth();


  // ==========================================
  // STATES
  // ==========================================
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const result = await login(
      formData.email,
      formData.password
    );

    if (result.success) {
      if (result.role === "collector") {
        navigate("/collector/dashboard");
      } else if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {

      setError(result.message);

    }

    setLoading(false);
  };


  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return <Loader />;
  }


  return (
    <>

      <Navbar />

      <div className="auth-page">

        <div className="auth-container">

          {/* ================================= */}
          {/* LEFT */}
          {/* ================================= */}

          <div className="auth-left">

            <h1>
              Welcome Back 👋
            </h1>

            <p>
              Login to continue your
              smart recycling journey
              with Scrapify.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/6797/6797200.png"
              alt="Login"
            />

          </div>


          {/* ================================= */}
          {/* RIGHT */}
          {/* ================================= */}

          <div className="auth-right">

            <div className="auth-card">

              <h2>
                Login
              </h2>

              <p>
                Enter your credentials
                to continue
              </p>


              {/* ERROR */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              {/* FORM */}
              <form
                onSubmit={handleSubmit}
              >

                {/* EMAIL */}
                <div className="auth-input-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"

                    placeholder="Enter your email"

                    value={formData.email}

                    onChange={handleChange}

                    required
                  />

                </div>


                {/* PASSWORD */}
                <div className="auth-input-group">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"

                    placeholder="Enter your password"

                    value={formData.password}

                    onChange={handleChange}

                    required
                  />

                </div>


                {/* BUTTON */}
                <Button
                  text="Login"
                  type="submit"
                  fullWidth={true}
                />

              </form>


              {/* REGISTER LINK */}
              <div className="auth-footer">

                <p>
                  Don’t have an account?
                </p>

                <Link to="/register">
                  Register
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
};

export default Login;