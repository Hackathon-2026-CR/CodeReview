import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/MyTasksPage.css";

function MyTasksPage() {
  const [myTasks, setMyTasks] = React.useState([]);
  const [workingTasks, setWorkingTasks] = React.useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username"); // ← fix
        if (!username) return;

        const response = await api.get(
          `/api/tasks/my-tasks/${username}`,
        );
        const data = await response.json();
        setMyTasks(data || []);
      } catch (error) {
        console.error("Error fetching my tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.username]);

  useEffect(() => {
    const fetchWorkingTasks = async () => {
      try {
        const username = localStorage.getItem("username"); // ← fix
        if (!username) return;

        const response = await api.get(
          `/api/tasks/working-tasks/${username}`,
        );
        const data = await response.json();
        setWorkingTasks(data || []);
      } catch (error) {
        console.error("Error fetching working tasks:", error);
      }
    };

    fetchWorkingTasks();
  }, [user?.username]);

  return (
    <div>
      <Navbar />
      <div className="my-tasks-page">
        <div>
          <h1>Tasks I'm working on :</h1>
          <ul>
            {workingTasks.length === 0 ? (
              <p className="my-tasks-empty">No tasks in progress.</p>
            ) : (
              workingTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate(`/task-details/${task.id}`)}
                >
                  {task.title}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="my-tasks-container">
          <h1>My Tasks :</h1>
          <ul>
            {myTasks.length === 0 ? (
              <p className="my-tasks-empty">No tasks created yet.</p>
            ) : (
              myTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate(`/task-details/${task.id}`)}
                >
                  {task.title}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="add-task">
          <button onClick={() => navigate("/add-task")}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default MyTasksPage;
