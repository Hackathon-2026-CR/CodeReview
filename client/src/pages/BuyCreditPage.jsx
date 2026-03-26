import { useState, useEffect } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/BuyCreditsPage.css";

const packs = [
  { id: 1, credits: 50, price: 5, label: "Starter" },
  { id: 2, credits: 120, price: 10, label: "Basic" },
  { id: 3, credits: 300, price: 20, label: "Pro", popular: true },
  { id: 4, credits: 1000, price: 50, label: "Elite" },
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
  const [success, setSuccess] = useState(false);
  const [fetchError, setFetchError] = useState(null); // ✅ Fix — erreur UI fetch

  useEffect(() => {
    const fetchCredits = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;
      try {
        const res = await api.get(`/api/tasks/users/${username}`);

        // ✅ Fix — vérifier response.ok
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
      alert("Please select a credit pack first.");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      const newCredits = credits + selectedPack.credits;

      const res = await api.post("/api/tasks/update-user", {
        name: username,
        credits: newCredits,
      });

      // ✅ Fix — vérifier response.ok
      if (!res.ok) {
        alert("Server error. Could not process purchase.");
        return;
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // ✅ Fix — ne pas polluer auth_user avec credits
      // auth_user contient { id, username }, on ne le modifie pas
      setCredits(newCredits);
      setSelectedPack(null); // ✅ reset sélection après achat
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
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
            {/* ✅ Fix — afficher erreur si fetch échoue */}
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

        {/* ── Payment ── */}
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
                {selectedPack.label}) for{" "}
                <strong>${selectedPack.price}</strong> via{" "}
                <strong>
                  {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                </strong>
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
            {loading ? "Processing..." : "Confirm Purchase"}
          </button>

          {success && (
            <div className="bc-success">
              ✅ {selectedPack === null ? "Credits" : ""} added to your account!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
