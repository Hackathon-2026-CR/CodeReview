import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/AllTasksPage.css";
import toast, { Toaster } from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

function AllTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTasks = useCallback(async (silent = false) => {
    const username = localStorage.getItem("username");
    if (!username) {
      toast.error("You are not logged in.");
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    else setReloading(true);

    try {
      const response = await api.get(`/api/tasks/all-tasks/${username}`);
      if (!response.ok) {
        toast.error("Something went wrong. Please try again later.");
        return;
      }
      const data = await response.json();
      setTasks(data || []);
      if (silent) toast.success("Tasks refreshed!");
    } catch {
      toast.error("Network error. Check your internet connection.");
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const allLanguages = useMemo(() => {
    const langs = tasks.flatMap((t) => t.languages || []);
    return ["All", ...new Set(langs)];
  }, [tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchLang =
        langFilter === "All" || task.languages?.includes(langFilter);
      return matchSearch && matchLang;
    });
  }, [tasks, search, langFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleLang = (e) => {
    setLangFilter(e.target.value);
    setCurrentPage(1);
  };

  const SkeletonCard = () => (
    <li className="all-tasks-item all-tasks-skeleton">
      <div className="skeleton-bar skeleton-task-title" />
      <div className="skeleton-bar skeleton-task-desc" />
      <div className="skeleton-bar skeleton-task-desc short" />
      <div className="skeleton-bar skeleton-task-btn" />
    </li>
  );

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="all-tasks-container">
        {/* ── Header ── */}
        <div className="all-tasks-header">
          <h1 className="all-tasks-title">All Tasks Available</h1>
          <button
            className={`all-tasks-reload-btn ${reloading ? "spinning" : ""}`}
            onClick={() => fetchTasks(true)}
          >
            <RefreshCw size={13} />
            Reload
          </button>
        </div>

        {/* ── Filtres ── */}
        {!loading && (
          <div className="all-tasks-filters">
            <input
              className="all-tasks-search"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch}
            />
            <select
              className="all-tasks-select"
              value={langFilter}
              onChange={handleLang}
            >
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <ul className="all-tasks-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </ul>
        ) : paginated.length === 0 ? (
          <p className="all-tasks-empty">No tasks found.</p>
        ) : (
          <>
            <ul className="all-tasks-list">
              {paginated.map((task) => (
                <li key={task._id} className="all-tasks-item">
                  <div className="all-tasks-item-header">
                    <h3>{task.title}</h3>
                    <span className="all-tasks-price">
                      {task.price} credits
                    </span>
                  </div>
                  {task.description && (
                    <p className="all-tasks-description">{task.description}</p>
                  )}
                  <div className="all-tasks-meta">
                    {task.languages?.map((lang) => (
                      <span key={lang} className="all-tasks-badge">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button
                    className="all-tasks-btn"
                    onClick={() => navigate(`/task-details/${task._id}`)}
                  >
                    View Task
                  </button>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="all-tasks-pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllTasksPage;
