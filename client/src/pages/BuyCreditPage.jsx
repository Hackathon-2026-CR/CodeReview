import { useState, useEffect } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/BuyCreditsPage.css";
import toast, { Toaster } from "react-hot-toast";

const packs = [
  { id: "starter", credits: 50, price: 5, label: "Starter" },
  { id: "basic", credits: 120, price: 10, label: "Basic" },
  { id: "pro", credits: 300, price: 20, label: "Pro", popular: true },
  { id: "elite", credits: 1000, price: 50, label: "Elite" },
];

const paymentMethods = [
  { id: "card", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "crypto", label: "Crypto" },
];

export default function BuyCreditsPage() {
  const [credits, setCredits] = useState(0);
  const [selectedPack, setSelectedPack] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;
      try {
        const res = await api.get(`/api/users/${username}`);
        if (!res.ok) {
          setFetchError("Could not load your balance.");
          return;
        }
        const data = await res.json();
        if (data?.credits !== undefined) setCredits(data.credits);
      } catch {
        setFetchError("Network error. Could not load your balance.");
      }
    };
    fetchCredits();
  }, []);

  async function handlePurchase() {
    if (!selectedPack) {
      toast.error("Please select a credit pack first.");
      return;
    }
    const username = localStorage.getItem("username");
    if (!username) {
      toast.error("You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "card") {
        const res = await api.post("/api/payments/create-checkout", {
          username,
          package: selectedPack.id,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Server error.");
          return;
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        toast.error("Stripe session creation failed.");
        return;
      }

      // PayPal / Crypto — simulation
      const newCredits = credits + selectedPack.credits;
      const res = await api.post("/api/users/update-user", {
        name: username,
        credits: newCredits,
      });
      if (!res.ok) {
        toast.error("Server error. Could not process purchase.");
        return;
      }
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setCredits(newCredits);
      setSelectedPack(null);
      toast.success("Credits added to your account!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="bc-page">
        {/* ── Header ── */}
        <div className="bc-header">
          <div>
            <h1 className="bc-title">
              Buy <span>Credits</span>
            </h1>
            <p className="bc-subtitle">
              Choose a pack and start reviewing code
            </p>
          </div>
          <div className="bc-balance">
            <span>Current balance</span>
            <strong>{fetchError ? "—" : `${credits} credits`}</strong>
            {fetchError && (
              <p style={{ color: "red", fontSize: "0.75rem" }}>{fetchError}</p>
            )}
          </div>
        </div>

        {/* ── Packs ── */}
        <section>
          <p className="bc-section-label">Select a Pack</p>
          <div className="bc-grid">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className={`bc-card ${selectedPack?.id === pack.id ? "selected" : ""} ${pack.popular ? "popular" : ""}`}
                onClick={() => setSelectedPack(pack)}
              >
                {pack.popular && <div className="bc-popular">Most Popular</div>}
                <p className="bc-card-label">{pack.label}</p>
                <h2 className="bc-card-credits">{pack.credits}</h2>
                <p className="bc-card-credits-sub">credits</p>
                <div className="bc-divider" />
                <p className="bc-card-price">${pack.price}</p>
                <p className="bc-card-rate">
                  ${(pack.price / pack.credits).toFixed(3)} / credit
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payment Method ── */}
        <section>
          <p className="bc-section-label">Payment Method</p>
          <div className="bc-payment-row">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`bc-payment-card ${paymentMethod === method.id ? "selected" : ""}`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div
                  className={`bc-payment-dot ${paymentMethod === method.id ? "active" : ""}`}
                />
                {method.label}
              </div>
            ))}
          </div>
        </section>

        {/* ── Summary ── */}
        <div className="bc-summary">
          <div className="bc-summary-text">
            {selectedPack ? (
              <p>
                You are purchasing{" "}
                <strong>{selectedPack.credits} credits</strong> (
                {selectedPack.label}) for <strong>${selectedPack.price}</strong>{" "}
                via{" "}
                <strong>
                  {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                </strong>
                {paymentMethod === "card" &&
                  " — you will be redirected to Stripe"}
              </p>
            ) : (
              <p className="bc-hint">Select a pack above to continue</p>
            )}
          </div>

          <button
            className="bc-btn"
            onClick={handlePurchase}
            disabled={loading || !selectedPack}
          >
            {loading
              ? paymentMethod === "card"
                ? "Redirecting..."
                : "Processing..."
              : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}
