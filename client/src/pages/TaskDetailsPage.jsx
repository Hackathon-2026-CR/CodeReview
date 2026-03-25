import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        // endpoint 6 : "/api/tasks/:id"
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
        <div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
      ) : (
        <p>Task not found</p>
      )}
    </div>
  );
}

export default TaskDetailsPage;
