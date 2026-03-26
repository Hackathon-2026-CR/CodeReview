import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/TaskDetailsPage.css";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/api/tasks/${id}`);
        if (!res.ok) {
          setError("Task not found.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTask(data);
      } catch {
        setError("Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleTakeTask = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/api/tasks/take-task/${id}`, {
        reviewer: username,
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not take task.");
        return;
      }
      setTask((prev) => ({ ...prev, status: "review in process", reviewer: username }));
      setSuccess("Task taken! You can now review the code.");
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/api/tasks/submit-review/${id}`, {
        reviewer: username,
        rating: parseInt(rating),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not submit review.");
        return;
      }
      setTask((prev) => ({ ...prev, status: "reviewed", rating: parseInt(rating) }));
      setSuccess("Review submitted successfully!");
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div><Navbar /><p className="td-empty">Loading...</p></div>;
  if (error)   return <div><Navbar /><p className="td-empty">{error}</p></div>;
  if (!task)   return null;

  const isCreator  = username === task.user_name;
  const isReviewer = username === task.reviewer;
  const isVisitor  = !isCreator && !isReviewer;

  return (
    <div>
      <Navbar />
      <div className="td-container">

        {/* ── Header ── */}
        <div className="td-header">
          <h1 className="td-title">{task.title}</h1>
          <span className={`td-status td-status--${task.status.replace(/ /g, "-")}`}>
            {task.status}
          </span>
        </div>

        {/* ── Meta ── */}
        <div className="td-meta">
          <span>By <strong>{task.user_name}</strong></span>
          <span><strong>{task.price}</strong> credits</span>
          {task.languages?.length > 0 && (
            <span>{task.languages.join(", ")}</span>
          )}
        </div>

        {task.description && (
          <p className="td-description">{task.description}</p>
        )}

        {/* ── Code (créateur + reviewer uniquement) ── */}
        {(isCreator || isReviewer) && task.code && (
          <div className="td-code-block">
            <h2>Code</h2>
            <pre><code>{task.code}</code></pre>
          </div>
        )}

        {/* ── Rating final ── */}
        {task.status === "reviewed" && (
          <div className="td-rating">
            ⭐ Rating : <strong>{task.rating} / 5</strong>
          </div>
        )}

        {/* ── Success message ── */}
        {success && <p className="td-success">{success}</p>}

        {/* ── Actions selon le rôle ── */}

        {/* Visiteur — peut prendre la task */}
        {isVisitor && task.status === "pending" && (
          <button
            className="td-btn"
            onClick={handleTakeTask}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : `Take Task (${task.price} credits)`}
          </button>
        )}

        {/* Reviewer en cours — peut soumettre la review */}
        {isReviewer && task.status === "review in process" && (
          <div className="td-review-form">
            <h2>Submit your review</h2>
            <label>
              Rating (1–5) :
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="td-rating-input"
              />
            </label>
            <button
              className="td-btn"
              onClick={handleSubmitReview}
              disabled={actionLoading}
            >
              {actionLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {/* Créateur — voit juste le statut */}
        {isCreator && (
          <p className="td-info">
            {task.status === "pending" && "⏳ Waiting for a reviewer..."}
            {task.status === "review in process" && `🔍 Being reviewed by ${task.reviewer}`}
            {task.status === "reviewed" && "✅ Your task has been reviewed!"}
          </p>
        )}

        <button className="td-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}
