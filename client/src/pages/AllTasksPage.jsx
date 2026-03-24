import React from "react";
import { useNavigate } from "react-router-dom";


function AllTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(`/api/tasks/all-tasks/${username}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
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
