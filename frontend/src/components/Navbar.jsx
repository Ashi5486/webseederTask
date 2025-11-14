import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ Destructure from context

  return (
    <div className="flex items-center justify-between h-12 bg-teal-600 px-5 text-white shadow-md">
      <p>
        Welcome,{" "}
        <span className="font-semibold">
          {user?.name || "Guest"}
        </span>
      </p>

      <button
        onClick={logout} // ✅ Hooked up logout function
        className="px-4 py-1 bg-teal-700 rounded hover:bg-teal-800 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
