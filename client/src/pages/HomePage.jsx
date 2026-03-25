import React from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/HomePage.css";

function HomePage() {
  const [user, setUser] = React.useState(null);
  const { user: authUser } = useAuth();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = localStorage.getItem("username"); // ← fix variable manquante
        if (!username) return;

        const response = await api.get(`/api/tasks/users/${username}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [authUser?.username]);

  return (
    <div>
      <Navbar />
      <div className="home-page">
        <h1>Welcome to CodeReview app !</h1>

        {user && (
          <div className="home-user-card">
            <p>
              Hello, <span>{user.name}</span>!
            </p>{" "}
            {/* ← "name" pas "username" */}
            <p>
              Email: <span>{user.email}</span>
            </p>
            <p>
              Credits: <span>{user.credits}</span>
            </p>
            <p>
              Rating: <span>{user.rating} / 5</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
