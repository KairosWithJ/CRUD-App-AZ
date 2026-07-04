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
        <Link to="/">Browse All Items</Link>
        {user && <Link to="/inventory">My Inventory</Link>}
        {user && <Link to="/items/new">Add Item</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.firstName}</span>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
