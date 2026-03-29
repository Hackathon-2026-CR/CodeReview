import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCode, FaStar, FaCoins, FaUsers } from "react-icons/fa";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>CodeReview</h1>
          </div>
          <div className="landing-auth-buttons">
            <button
              className="landing-btn landing-btn-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="landing-btn landing-btn-register"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <h2 className="hero-title">Get Expert Code Reviews</h2>
            <p className="hero-subtitle">
              Share your code, learn from experts, build your reputation, and
              earn credits
            </p>
            <div className="hero-buttons">
              <button
                className="landing-btn landing-btn-primary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
              <button
                className="landing-btn landing-btn-secondary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          <h3>How CodeReview Works</h3>
          <div className="features-grid">
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

        {/* CTA Section */}
        <section className="landing-cta">
          <div className="cta-content">
            <h3>Ready to improve your code?</h3>
            <p>Join thousands of developers getting expert feedback</p>
            <button
              className="landing-btn landing-btn-primary-large"
              onClick={() => navigate("/register")}
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 CodeReview. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
