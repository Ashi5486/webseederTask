import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ For clean navigation
import bgImage from "../assets/img.png"; // ✅ Ensure path is correct

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // ✅ Redirect if already logged in
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "admin") {
      navigate("/admin");
    } else if (storedRole === "member") {
      navigate("/member"); // ✅ Fixed route
    }
  }, [navigate]);

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {
      const { data, status } = await axios.post(endpoint, payload);

      if (status === 200 || status === 201) {
        if (isLogin) {
          const userRole = data?.role || data?.user?.role || "member";
          const token = data?.token;

          if (!token) {
            alert("❌ Token not received. Please try again.");
            return;
          }

          localStorage.setItem("token", token);
          localStorage.setItem("role", userRole);

          // ✅ Redirect based on role
          if (userRole === "admin") {
            navigate("/admin");
          } else if (userRole === "member") {
            navigate("/member"); // ✅ Fixed route
          } else {
            alert("Unknown role. Please contact support.");
          }
        } else {
          alert("✅ Signup successful! Please log in now.");
          setIsLogin(true);
          setName("");
          setEmail("");
          setPassword("");
          setRole("");
        }
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("⚠️ Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "An error occurred. Please check your inputs or try again later."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">
      {/* ✅ Left Side - Background Image */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative">
        <div className="absolute inset-0 bg-blue-600/70 z-10"></div>
        <img
          src={bgImage}
          alt="Project Management Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
        />
        <div className="relative z-20 flex flex-col items-center justify-center text-white w-full text-center p-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Mini Project Management System
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 font-light max-w-md drop-shadow-md">
            Streamline your team collaboration and project tracking with our
            intuitive platform.
          </p>
        </div>
      </div>

      {/* ✅ Right Side - Auth Form */}
      <div className="flex w-full md:w-7/12 lg:w-1/2 items-center justify-center p-4 sm:p-6 md:p-12">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg transition-all duration-500 transform hover:shadow-3xl">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
            {isLogin ? "Welcome Back!" : "Create Your Account"}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isLogin
              ? "Sign in to continue to your workspace."
              : "Create your account to start managing projects."}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Signup Fields */}
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition duration-150"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Select Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition duration-150 appearance-none"
                  >
                    <option value="" disabled>
                      -- Choose your role --
                    </option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition duration-150"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition duration-150"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full ${
                isLogin
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              } text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 mt-6`}
            >
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          {/* Toggle between login/signup */}
          <p className="text-sm text-center text-gray-500 mt-6">
            {isLogin ? "New to the platform?" : "Already a member?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 font-bold transition duration-150"
            >
              {isLogin ? "Sign Up Now" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
