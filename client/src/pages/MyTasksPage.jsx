import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/MyTasksPage.css";

function MyTasksPage() {
  const [myTasks, setMyTasks] = useState([]);
  const [workingTasks, setWorkingTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const [myRes, workingRes, finishedRes] = await Promise.all([
          api.get(`/api/tasks/my-tasks/${username}`),
          api.get(`/api/tasks/working-tasks/${username}`),
          api.get(`/api/tasks/finished-tasks/${username}`),
        ]);

        if (!myRes.ok || !workingRes.ok || !finishedRes.ok) {
          setError("Something went wrong. Please try again later.");
          setLoading(false);
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
      } catch {
        setError("Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  const renderList = (tasks, emptyMsg) =>
    tasks.length === 0 ? (
      <li className="my-tasks-empty">{emptyMsg}</li>
    ) : (
      tasks.map((task) => (
        <li
          key={task._id}
          onClick={() => navigate(`/task-details/${task._id}`)}
        >
          <span>{task.title}</span>
          <span className="my-tasks-status">{task.status}</span>
        </li>
      ))
    );

  return (
    <div>
      <Navbar />
      <div className="my-tasks-page">
        {loading ? (
          <p className="my-tasks-empty">Loading tasks...</p>
        ) : error ? (
          <p className="my-tasks-empty">{error}</p>
        ) : (
          <>
            <div>
              <h1>Tasks I'm working on :</h1>
              <ul>{renderList(workingTasks, "No tasks in progress.")}</ul>
            </div>

            {/* ✅ Nouveau — tasks terminées */}
            <div>
              <h1>Tasks I've reviewed :</h1>
              <ul>{renderList(finishedTasks, "No finished reviews.")}</ul>
            </div>

            <div className="my-tasks-container">
              <h1>My Tasks :</h1>
              <ul>{renderList(myTasks, "No tasks created yet.")}</ul>
            </div>
          </>
        )}

        <div className="add-task">
          <button onClick={() => navigate("/add-task")}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default MyTasksPage;
