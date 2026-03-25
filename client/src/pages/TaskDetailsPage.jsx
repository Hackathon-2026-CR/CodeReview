import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/TaskDetailsPage.css";

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await api.get(`/api/tasks/${id}`);
        const data = await response.json();

        // Parse JSON strings from backend
        if (data?.languages) {
          try {
            data.languages = JSON.parse(data.languages);
          } catch {
            data.languages = [data.languages];
          }
        }
        if (data?.groups) {
          try {
            data.groups = JSON.parse(data.groups);
          } catch {
            data.groups = [data.groups];
          }
        }

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
            <div className="task-details-header">
              <h1>{task.title}</h1>
              {task.price && (
                <span className="task-details-price">{task.price} credits</span>
              )}
            </div>

            <hr className="task-details-divider" />

            <div className="task-details-meta">
              {task.languages?.map((lang) => (
                <span key={lang} className="task-details-badge lang">
                  {lang}
                </span>
              ))}
              {task.groups?.map((group) => (
                <span key={group} className="task-details-badge group">
                  {group}
                </span>
              ))}
            </div>

            {task.description && (
              <p className="task-details-description">{task.description}</p>
            )}

            {task.user_name && (
              <p className="task-details-author">
                Posted by <span>{task.user_name}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="task-not-found">Task not found</p>
      )}
    </div>
  );
}

export default TaskDetailsPage;
