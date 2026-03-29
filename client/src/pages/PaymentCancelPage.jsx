import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "5rem", color: "#cdd6f4" }}>
        <h1 style={{ color: "#f38ba8", marginBottom: "1rem" }}>Payment Cancelled</h1>
        <p style={{ fontSize: "1.1rem", color: "#a6adc8" }}>
          Your payment process was cancelled. You have not been charged.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/buy-credits")}
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: "#a78bfa",
              border: "1.5px solid #a78bfa",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              background: "#313244",
              color: "#cdd6f4",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
