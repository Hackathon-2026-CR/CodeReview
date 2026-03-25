import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/TaskDetailsPage.css";

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(
          `https://nonpositivistic-unmesmerised-sharyn.ngrok-free.dev/api/tasks/${id}`,
        );
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [id]);

  return (
    <div>
      <Navbar />
      {task ? (
        <div className="task-details-container">
          <div className="task-details-card">
            <h1>{task.title}</h1>
            <hr className="task-details-divider" />

            <div className="task-details-meta">
              {task.languages && (
                <span className="task-details-badge">🖥️ {task.languages}</span>
              )}
              {task.price && (
                <span className="task-details-badge">💰 {task.price}</span>
              )}
              {task.groups && (
                <span className="task-details-badge">👥 {task.groups}</span>
              )}
            </div>

            <p>{task.description}</p>
          </div>
        </div>
      ) : (
        <p className="task-not-found">Task not found</p>
      )}
    </div>
  );
}

export default TaskDetailsPage;
