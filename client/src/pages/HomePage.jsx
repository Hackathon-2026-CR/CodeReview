import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { FaCode, FaStar, FaCoins, FaUsers } from "react-icons/fa";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        const response = await api.get(`/api/tasks/users/${username}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [authUser?.username]);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to CodeReview</h1>
            <p className="hero-subtitle">
              Get expert code reviews. Share your expertise. Build your reputation.
            </p>
          </div>
        </section>

        {/* User Info Section */}
        {user && (
          <section className="home-user-section">
            <div className="user-info-card">
              <div className="user-header">
                <h2>Hello, {user.name}! 👋</h2>
                <p className="user-status">Welcome back</p>
              </div>

              <div className="user-stats">
                <div className="stat-item">
                  <FaCoins className="stat-icon coins" />
                  <div className="stat-content">
                    <span className="stat-label">Credits</span>
                    <span className="stat-value">{user.credits}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <FaStar className="stat-icon star" />
                  <div className="stat-content">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">{(user.rating || 0).toFixed(1)}/5</span>
                  </div>
                </div>

                <div className="stat-item">
                  <FaCode className="stat-icon code" />
                  <div className="stat-content">
                    <span className="stat-label">Email</span>
                    <span className="stat-value">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="home-actions">
          <h3>What would you like to do?</h3>
          <div className="actions-grid">
            <div
              className="action-card"
              onClick={() => navigate("/all-tasks")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/all-tasks")}
            >
              <FaUsers className="action-icon" />
              <h4>Review Code</h4>
              <p>Browse available tasks and earn credits</p>
              <span className="action-arrow">→</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/add-task")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && navigate("/add-task")}
            >
              <FaCode className="action-icon" />
              <h4>Submit Code</h4>
              <p>Get your code reviewed by experts</p>
              <span className="action-arrow">→</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/my-tasks")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && navigate("/my-tasks")}
            >
              <FaCode className="action-icon" />
              <h4>My Tasks</h4>
              <p>Manage your submitted tasks</p>
              <span className="action-arrow">→</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/buy-credits")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && navigate("/buy-credits")}
            >
              <FaCoins className="action-icon" />
              <h4>Buy Credits</h4>
              <p>Get credits to post code reviews</p>
              <span className="action-arrow">→</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="home-features">
          <h3>How it works</h3>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number">1</div>
              <h4>Post Your Code</h4>
              <p>Upload your code and describe what you need reviewed</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">2</div>
              <h4>Get Reviewed</h4>
              <p>Expert reviewers submit their insights and suggestions</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">3</div>
              <h4>Rate & Learn</h4>
              <p>Rate the review and apply improvements to your code</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">4</div>
              <h4>Earn Credits</h4>
              <p>Review others' code and build your reputation</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
