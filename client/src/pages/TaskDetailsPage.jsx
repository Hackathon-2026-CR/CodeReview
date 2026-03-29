import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/TaskDetailsPage.css";
import toast, { Toaster } from "react-hot-toast";

const getLanguageExtension = (languages = []) => {
  const lang = languages[0]?.toLowerCase() || "";
  if (lang.includes("python")) return [python()];
  if (lang.includes("java") && !lang.includes("script")) return [java()];
  if (lang.includes("c++") || lang.includes("cpp")) return [cpp()];
  if (lang.includes("css")) return [css()];
  if (lang.includes("html")) return [html()];
  return [javascript()];
};

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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
        toast.error(data.error || "Could not take task.");
        return;
      }
      setTask((prev) => ({
        ...prev,
        status: "review in process",
        reviewer: username,
      }));
      toast.success("Task taken! You can now review the code.");
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTask = async () => {
    if (!window.confirm("Are you sure you want to cancel this task?")) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/api/tasks/cancel-task/${id}`, {
        reviewer: username,
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Could not cancel task.");
        return;
      }
      setTask((prev) => ({
        ...prev,
        status: "pending",
        reviewer: null,
        review_content: null,
      }));
      toast.success("Task cancelled successfully.");
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) {
      toast.error("Please write your review before submitting.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post(`/api/tasks/submit-review/${id}`, {
        reviewer: username,
        review_content: reviewContent,
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Could not submit review.");
        return;
      }
      setTask((prev) => ({
        ...prev,
        status: "reviewed",
        review_content: reviewContent,
      }));
      toast.success("Review submitted! Credits have been transferred.");
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateReview = async () => {
    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post(`/api/tasks/rate-review/${id}`, {
        creator: username,
        rating: parsedRating,
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Could not rate review.");
        return;
      }
      setTask((prev) => ({ ...prev, rating: parsedRating }));
      toast.success("Review rated successfully!");
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Skeleton ──
  if (loading)
    return (
      <div>
        <Navbar />
        <div className="td-container">
          <div className="td-skeleton">
            <div className="skeleton-bar td-sk-title" />
            <div className="skeleton-bar td-sk-meta" />
            <div className="skeleton-bar td-sk-desc" />
            <div className="skeleton-bar td-sk-code" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar />
        <p className="td-empty">{error}</p>
      </div>
    );

  if (!task) return null;

  const isCreator = username === task.user_name;
  const isReviewer = username === task.reviewer;
  const isVisitor = !isCreator && !isReviewer;
  const langExtensions = getLanguageExtension(task.languages);

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="td-container">
        {/* ── Header ── */}
        <div className="td-header">
          <h1 className="td-title">{task.title}</h1>
          <span
            className={`td-status td-status--${task.status.replace(/ /g, "-")}`}
          >
            {task.status}
          </span>
        </div>

        {/* ── Meta ── */}
        <div className="td-meta">
          <span>
            By <strong>{task.user_name}</strong>
          </span>
          <span>
            <strong>{task.price}</strong> credits
          </span>
          {task.languages?.length > 0 && (
            <span>{task.languages.join(", ")}</span>
          )}
        </div>

        {task.description && (
          <p className="td-description">{task.description}</p>
        )}

        {/* ── Code ── */}
        {(isCreator || isReviewer) && task.code && (
          <div className="td-code-block">
            <h2>Code to review</h2>
            <CodeMirror
              value={task.code}
              theme={oneDark}
              extensions={langExtensions}
              editable={false}
              basicSetup={{ lineNumbers: true, foldGutter: true }}
            />
          </div>
        )}

        {/* ── Review finale ── */}
        {isCreator && task.status === "reviewed" && task.review_content && (
          <div className="td-code-block">
            <h2>Review from {task.reviewer}</h2>
            <CodeMirror
              value={task.review_content}
              theme={oneDark}
              extensions={langExtensions}
              editable={false}
              basicSetup={{ lineNumbers: true, foldGutter: true }}
            />
          </div>
        )}

        {/* ── Rating affiché ── */}
        {task.rating != null && (
          <div className="td-rating">
            ⭐ Rating : <strong>{task.rating} / 5</strong>
          </div>
        )}

        {/* ── VISITEUR ── */}
        {isVisitor && task.status === "pending" && (
          <button
            className="td-btn"
            onClick={handleTakeTask}
            disabled={actionLoading}
          >
            {actionLoading
              ? "Processing..."
              : `Take Task (+${task.price} credits)`}
          </button>
        )}

        {/* ── REVIEWER ── */}
        {isReviewer && task.status === "review in process" && (
          <div className="td-review-form">
            <h2>Submit your review</h2>
            <div className="td-editor-wrapper">
              <CodeMirror
                value={reviewContent}
                height="300px"
                theme={oneDark}
                extensions={langExtensions}
                onChange={(value) => setReviewContent(value)}
                placeholder="Write your code review here..."
                basicSetup={{ lineNumbers: true, foldGutter: true }}
              />
            </div>
            <div className="td-review-actions">
              <button
                className="td-btn"
                onClick={handleSubmitReview}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                className="td-cancel-btn"
                onClick={handleCancelTask}
                disabled={actionLoading}
              >
                {actionLoading ? "Cancelling..." : "Cancel Task"}
              </button>
            </div>
          </div>
        )}

        {/* ── CRÉATEUR ── */}
        {isCreator && (
          <>
            <p className="td-info">
              {task.status === "pending" && "⏳ Waiting for a reviewer..."}
              {task.status === "review in process" &&
                `🔍 Being reviewed by ${task.reviewer}`}
              {task.status === "reviewed" &&
                task.rating == null &&
                "✅ Review received! Please rate it below."}
              {task.status === "reviewed" &&
                task.rating != null &&
                "✅ All done!"}
            </p>

            {task.status === "reviewed" && task.rating == null && (
              <div className="td-review-form">
                <h2>Rate this review</h2>
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
                  onClick={handleRateReview}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Submitting..." : "Rate Review"}
                </button>
              </div>
            )}
          </>
        )}

        <button className="td-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}
