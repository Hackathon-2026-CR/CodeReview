import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function HomePage() {
  const [user, setUser] = React.useState(null);
  const { user: authUser } = useAuth();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!authUser?.username) return;
        const response = await fetch(
          `https://nonpositivistic-unmesmerised-sharyn.ngrok-free.dev/api/tasks/users/${username}`,
        );
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
          <div>
            <p>Hello, {user.username}!</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
