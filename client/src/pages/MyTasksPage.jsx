import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RefreshCw } from "lucide-react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/MyTasksPage.css";
import toast, { Toaster } from "react-hot-toast";

function MyTasksPage() {
  const [myTasks, setMyTasks] = useState([]);
  const [workingTasks, setWorkingTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const navigate = useNavigate();

  const fetchAllTasks = useCallback(async (silent = false) => {
    const username = localStorage.getItem("username");
    if (!username) {
      toast.error("You are not logged in.");
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    else setReloading(true);

    try {
      const [myRes, workingRes, finishedRes] = await Promise.all([
        api.get(`/api/tasks/my-tasks/${username}`),
        api.get(`/api/tasks/working-tasks/${username}`),
        api.get(`/api/tasks/finished-tasks/${username}`),
      ]);

      if (!myRes.ok || !workingRes.ok || !finishedRes.ok) {
        toast.error("Something went wrong. Please try again later.");
        return;
      }

      const [myData, workingData, finishedData] = await Promise.all([
        myRes.json(),
        workingRes.json(),
        finishedRes.json(),
      ]);

      setMyTasks(myData || []);
      setWorkingTasks(workingData || []);
      setFinishedTasks(finishedData || []);

      if (silent) toast.success("Tasks refreshed!");
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const handleDelete = async (e, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const username = localStorage.getItem("username");
      const res = await api.delete(
        `/api/tasks/delete-task/${taskId}?username=${username}`,
      );
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Could not delete task.");
        return;
      }
      setMyTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Network error.");
    }
  };

  const getBadgeClass = (status) => {
    if (status === "pending") return "my-tasks-badge badge-pending";
    if (status === "review in process") return "my-tasks-badge badge-review";
    return "my-tasks-badge badge-reviewed";
  };

  const SkeletonList = () => (
    <ul className="my-tasks-list">
      {[1, 2, 3].map((i) => (
        <li key={i} className="my-tasks-skeleton">
          <span className="skeleton-bar skeleton-title" />
          <span className="skeleton-bar skeleton-status" />
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="my-tasks-page">
        {/* ── Global header ── */}
        <div className="my-tasks-header">
          <h2>My Tasks</h2>
          <button
            className={`my-tasks-reload-btn ${reloading ? "spinning" : ""}`}
            onClick={() => fetchAllTasks(true)}
          >
            <RefreshCw size={13} />
            Reload
          </button>
        </div>

        {/* ── 3 colonnes ── */}
        <div className="my-tasks-columns">
          {/* ── Tasks en cours ── */}
          <div className="my-tasks-section">
            <h1>Tasks I'm working on</h1>
            {loading ? (
              <SkeletonList />
            ) : (
              <ul className="my-tasks-list">
                {workingTasks.length === 0 ? (
                  <li className="my-tasks-empty">No tasks in progress.</li>
                ) : (
                  workingTasks.map((task) => (
                    <li
                      key={task._id}
                      className="my-tasks-card"
                      onClick={() => navigate(`/task-details/${task._id}`)}
                    >
                      <div className="my-tasks-card-top">
                        <span className="my-tasks-card-title">
                          {task.title}
                        </span>
                        <span className={getBadgeClass(task.status)}>
                          {task.status}
                        </span>
                      </div>
                      <div className="my-tasks-card-meta">
                        <span>{task.languages?.join(", ")}</span>
                        <span>{task.price} credits</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* ── Tasks reviewées ── */}
          <div className="my-tasks-section">
            <h1>Tasks I've reviewed</h1>
            {loading ? (
              <SkeletonList />
            ) : (
              <ul className="my-tasks-list">
                {finishedTasks.length === 0 ? (
                  <li className="my-tasks-empty">No finished reviews.</li>
                ) : (
                  finishedTasks.map((task) => (
                    <li
                      key={task._id}
                      className="my-tasks-card"
                      onClick={() => navigate(`/task-details/${task._id}`)}
                    >
                      <div className="my-tasks-card-top">
                        <span className="my-tasks-card-title">
                          {task.title}
                        </span>
                        <span className={getBadgeClass(task.status)}>
                          {task.status}
                        </span>
                      </div>
                      <div className="my-tasks-card-meta">
                        <span>{task.languages?.join(", ")}</span>
                        <span>{task.price} credits</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* ── Mes tasks publiées ── */}
          <div className="my-tasks-section">
            <h1>My Tasks</h1>
            {loading ? (
              <SkeletonList />
            ) : (
              <ul className="my-tasks-list">
                {myTasks.length === 0 ? (
                  <li className="my-tasks-empty">No tasks created yet.</li>
                ) : (
                  myTasks.map((task) => (
                    <li
                      key={task._id}
                      className="my-tasks-card"
                      onClick={() => navigate(`/task-details/${task._id}`)}
                    >
                      <div className="my-tasks-card-top">
                        <span className="my-tasks-card-title">
                          {task.title}
                        </span>
                        <span className={getBadgeClass(task.status)}>
                          {task.status}
                        </span>
                      </div>
                      <div className="my-tasks-card-bottom">
                        <div className="my-tasks-card-meta">
                          <span>{task.languages?.join(", ")}</span>
                          <span>{task.price} credits</span>
                        </div>
                        {task.status === "pending" && (
                          <button
                            className="my-tasks-delete-btn"
                            onClick={(e) => handleDelete(e, task._id)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="add-task">
          <button onClick={() => navigate("/add-task")}>+ Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default MyTasksPage;
