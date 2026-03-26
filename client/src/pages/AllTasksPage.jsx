import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/AllTasksPage.css";

function AllTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username");

        if (!username) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/tasks/all-tasks/${username}`);

        // ✅ Fix — vérifier response.ok avant de parser
        if (!response.ok) {
          setError("Something went wrong. Please try again later.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTasks(data || []);
      } catch (err) {
        setError("Network error. Check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // ✅ Fix — pas besoin de dépendance, username vient du localStorage

  return (
    <div>
      <Navbar />
      <div className="all-tasks-container">
        <h1 className="all-tasks-title">All Tasks Available</h1>

        {/* ✅ Fix — état loading */}
        {loading ? (
          <p className="all-tasks-empty">Loading tasks...</p>
        ) : error ? (
          // ✅ Fix — affichage erreur UI
          <p className="all-tasks-empty">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="all-tasks-empty">No tasks available yet.</p>
        ) : (
          <ul className="all-tasks-list">
            {tasks.map((task) => (
              <li key={task._id} className="all-tasks-item">
                <div className="all-tasks-item-header">
                  <h3>{task.title}</h3>
                  <span className="all-tasks-price">{task.price} credits</span>
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
        )}
      </div>
    </div>
  );
}

export default AllTasksPage;
