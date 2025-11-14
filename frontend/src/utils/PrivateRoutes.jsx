import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children, role }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (role && !role.includes(user.role)) {
      // Redirect if role mismatch
      navigate("/unauthorized");
    }
  }, [user, role, navigate]);

  if (!user || (role && !role.includes(user.role))) {
    return null; // can replace with a spinner/loading screen
  }

  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoutes;
