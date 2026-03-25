import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/AllTasksPage.css";

function AllTasksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await api.get(`/api/tasks/all-tasks/${username}`);
        const data = await response.json();
        console.log("data:", data); // ← pour voir la structure

        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.username]);

  return (
    <div>
      <Navbar />
      <div className="all-tasks-container">
        <h1 className="all-tasks-title">All Tasks Available</h1>

        {tasks.length === 0 ? (
          <p className="all-tasks-empty">No tasks available yet.</p>
        ) : (
          <ul className="all-tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className="all-tasks-item">
                <div className="all-tasks-item-header">
                  <h3>{task.title}</h3>
                  <span className="all-tasks-price">{task.price} credits</span>
                </div>

                {task.description && (
                  <p className="all-tasks-description">{task.description}</p>
                )}

                <div className="all-tasks-meta">
                  {task.languages &&
                    (() => {
                      try {
                        const langs = Array.isArray(task.languages)
                          ? task.languages
                          : JSON.parse(task.languages);
                        return langs.map((lang) => (
                          <span key={lang} className="all-tasks-badge">
                            {lang}
                          </span>
                        ));
                      } catch {
                        return (
                          <span className="all-tasks-badge">
                            {task.languages}
                          </span>
                        );
                      }
                    })()}
                </div>

                <button
                  className="all-tasks-btn"
                  onClick={() => navigate(`/task-details/${task.id}`)}
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
