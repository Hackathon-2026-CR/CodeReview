import React from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/HomePage.css";

function HomePage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // ✅ Fix — loading state
  const [error, setError] = React.useState(null);     // ✅ Fix — error state

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/tasks/users/${username}`);

        // ✅ Fix — vérifier response.ok
        if (!response.ok) {
          setError("Could not load your profile.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch {
        setError("Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // ✅ Fix — dépendance vide, username vient du localStorage

  return (
    <div>
      <Navbar />
      <div className="home-page">
        <h1>Welcome to CodeReview app!</h1>

        {/* ✅ Fix — états loading / error */}
        {loading ? (
          <p className="home-loading">Loading your profile...</p>
        ) : error ? (
          <p className="home-error">{error}</p>
        ) : user ? (
          <div className="home-user-card">
            <p>Hello, <span>{user.name}</span>!</p>
            <p>Email: <span>{user.email}</span></p>
            <p>Credits: <span>{user.credits}</span></p>
            {/* ✅ Fix — rating retiré, n'existe pas sur User */}
            {user.languages?.length > 0 && (
              <p>
                Languages:{" "}
                <span>{user.languages.join(", ")}</span>
              </p>
            )}
            {user.price && (
              <p>Review Price: <span>${user.price}</span></p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomePage;
