import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyTasksPage() {
  const [myTasks, setMyTasks] = React.useState([]);
  const [workingTasks, setWorkingTasks] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(`/api/tasks/my-tasks/${username}`);
        const data = await response.json();
        setMyTasks(data);
      } catch (error) {
        console.error("Error fetching my tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchWorkingTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(`/api/tasks/working-tasks/${username}`);
        const data = await response.json();
        setWorkingTasks(data);
      } catch (error) {
        console.error("Error fetching working tasks:", error);
      }
    };

    fetchWorkingTasks();
  }, []);

  return (
    <div>
      <div className="my-tasks-page">
        <div>
          <h1>Tasks I'm working on :</h1>
          <ul>
            {workingTasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>

        <div className="my-tasks-container">
          <h1>My Tasks :</h1>
          <ul>
            {myTasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
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
