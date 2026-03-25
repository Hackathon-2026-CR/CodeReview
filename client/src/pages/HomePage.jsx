import React from "react";
import Navbar from "../components/Navbar";

function HomePage() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

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
  }, []);

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
