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


const Register = () => {

  const navigate = useNavigate();

  const {
    register,
  } = useAuth();


  // ==========================================
  // STATES
  // ==========================================
const [formData, setFormData] =
  useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    role: "user",
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

    const result = await register(
      formData
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
              Join Scrapify ♻️
            </h1>

            <p>
              Start your eco-friendly
              journey and turn your
              household waste into
              valuable rewards.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/6797/6797200.png"
              alt="Register"
            />

          </div>


          {/* ================================= */}
          {/* RIGHT */}
          {/* ================================= */}

          <div className="auth-right">

            <div className="auth-card">

              <h2>
                Create Account
              </h2>

              <p>
                Register to start
                recycling smarter
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

                {/* NAME */}
                <div className="auth-input-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"

                    placeholder="Enter your full name"

                    value={formData.name}

                    onChange={handleChange}

                    required
                  />

                </div>


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

                {/* PHONE */}
                <div className="auth-input-group">

                <label>
                Phone Number
               </label>

              <input
              type="text"
              name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
             required/>

          </div>


                {/* PASSWORD */}
                <div className="auth-input-group">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"

                    placeholder="Create a password"

                    value={formData.password}

                    onChange={handleChange}

                    required
                  />

                </div>


                {/* ADDRESS */}
<div className="auth-input-group">

  <label>
    Address
  </label>

  <textarea
    name="address"

    placeholder="Enter your address"

    value={formData.address}

    onChange={handleChange}

    required
  ></textarea>

</div>

<div className="auth-input-group">

  <label>
    City
  </label>

  <input
    type="text"
    name="city"
    value={formData.city}
    onChange={handleChange}
    placeholder="Enter city"
  />

</div>


<div className="auth-input-group">

  <label>
    State
  </label>

  <input
    type="text"
    name="state"
    value={formData.state}
    onChange={handleChange}
    placeholder="Enter state"
  />

</div>


<div className="auth-input-group">

  <label>
    Pincode
  </label>

  <input
    type="text"
    name="pincode"
    value={formData.pincode}
    onChange={handleChange}
    placeholder="Enter pincode"
  />

</div>


{/* ROLE */}
<div className="auth-input-group">

  <label>
    Select Role
  </label>

  <select
    name="role"

    value={formData.role}

    onChange={handleChange}
  >

    <option value="user">
      User
    </option>

    <option value="collector">
      Collector
    </option>

    <option value="admin">
      Admin
    </option>

  </select>

</div>


                {/* BUTTON */}
                <Button
                  text="Create Account"
                  type="submit"
                  fullWidth={true}
                />

              </form>


              {/* LOGIN LINK */}
              <div className="auth-footer">

                <p>
                  Already have an account?
                </p>

                <Link to="/login">
                  Login
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
};

export default Register;