import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function AllTasksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?.username) return;
        const response = await fetch(
          `http://localhost:8000/api/tasks/all-tasks/${user.username}`,
        );
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.username]);

  return (
    <div>
      <Navbar />
      <h1>All Tasks Available:</h1>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => navigate(`/task-details/${task.id}`)}>
              View Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllTasksPage;
