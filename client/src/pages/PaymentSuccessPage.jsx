import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [credits, setCredits] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get("credits");
    if (c) setCredits(c);
  }, [location.search]);

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "5rem", color: "#cdd6f4" }}>
        <h1 style={{ color: "#a6e3a1", marginBottom: "1rem" }}>Payment Successful! 🎉</h1>
        {credits && (
          <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            You have successfully purchased <strong>{credits}</strong> credits.
          </p>
        )}
        <p style={{ color: "#a6adc8" }}>Thank you for your purchase. They have been added to your balance.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            background: "linear-gradient(135deg, #a78bfa, #c4b5fd)",
            color: "#11111b",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(167, 139, 250, 0.3)"
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
