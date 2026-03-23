import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const pages = [
  { name: "Home", path: "/" },
  { name: "All Tasks", path: "/all-tasks" },
  { name: "My Tasks", path: "/my-tasks" },
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
    <nav style={styles.nav}>
      <div style={styles.logo}>MyApp</div>

      <ul style={styles.navList}>
        {pages.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === page.path ? styles.activeLink : {}),
              }}
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ul>

      <div style={styles.accountWrapper}>
        <button
          style={styles.accountBtn}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          My Account
        </button>

        {dropdownOpen && (
          <div style={styles.dropdown}>
            <Link
              to="/account"
              style={styles.dropdownItem}
              onClick={() => setDropdownOpen(false)}
            >
              Account Info
            </Link>
            <hr style={styles.divider} />
            <button
              style={{ ...styles.dropdownItem, ...styles.logoutBtn }}
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

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    height: "60px",
    backgroundColor: "#1e1e2e",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#a78bfa",
    letterSpacing: "1px",
  },
  navList: {
    display: "flex",
    gap: "1.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "#cdd6f4",
    textDecoration: "none",
    fontSize: "0.95rem",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  activeLink: {
    backgroundColor: "#a78bfa22",
    color: "#a78bfa",
    fontWeight: "bold",
  },
  accountWrapper: {
    position: "relative",
  },
  accountBtn: {
    background: "transparent",
    border: "1px solid #a78bfa",
    color: "#cdd6f4",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "110%",
    backgroundColor: "#2a2a3e",
    border: "1px solid #a78bfa44",
    borderRadius: "10px",
    padding: "8px",
    minWidth: "180px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  dropdownItem: {
    display: "block",
    padding: "8px 12px",
    color: "#cdd6f4",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    textAlign: "left",
    width: "100%",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #ffffff11",
    margin: "4px 0",
  },
  logoutBtn: {
    color: "#f38ba8",
  },
};
