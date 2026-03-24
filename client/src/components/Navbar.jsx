import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const pages = [
  { name: "Home", path: "/" },
  { name: "All Tasks", path: "/all-tasks" },
  { name: "My Tasks", path: "/my-tasks" },
  { name: "Add Task", path: "/add-task" },
  { name: "Task Details", path: "/task-details/:id" },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">MyApp</div>

      <ul className="navbar-list">
        {pages.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              className={`navbar-link ${location.pathname === page.path ? "active" : ""}`}
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-account-wrapper">
        <button
          className="navbar-account-btn"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          My Account
        </button>

        {dropdownOpen && (
          <div className="navbar-dropdown">
            <Link
              to="/account"
              className="navbar-dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              Account Info
            </Link>
            <hr className="navbar-divider" />
            <button
              className="navbar-dropdown-item navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
