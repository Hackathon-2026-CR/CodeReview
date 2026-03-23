import React from "react";
import Navbar from "../components/Navbar";
import "../styles/AddTaskPage.css";

function AddTaskPage() {
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
  });

  const addTask = async () => {
    try {
      // endpoint 4 : "/api/tasks/add-task"
      const response = await fetch("/api/tasks/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      console.log("Task added:", data);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-task-container">
        <h1 className="add-task-title">Add Task</h1>

        <div className="add-task-card">
          <div className="add-task-field">
            <label className="add-task-label">Title</label>
            <input
              className="add-task-input"
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Description</label>
            <textarea
              className="add-task-textarea"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
            />
          </div>

          <button className="add-task-btn" type="button" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskPage;