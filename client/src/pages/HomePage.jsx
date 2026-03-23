import React from "react";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="home-page">
        <h1>Welcome to CodeReview app !</h1>
      </div>
    </div>
  );
}

export default HomePage;
