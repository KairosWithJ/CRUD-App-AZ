import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { logout } from "../api.js";

const Nav = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Inventory
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Browse All Items
        </Link>
        {user && (
          <Link to="/inventory" className="nav-link">
            My Inventory
          </Link>
        )}
        {user && (
          <Link to="/items/new" className="nav-link">
            Add Item
          </Link>
        )}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.firstName}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
