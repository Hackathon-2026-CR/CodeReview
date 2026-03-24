import React, { useState } from "react";
import "../styles/AddTaskPage.css";
import Navbar from "../components/Navbar";

function AddTaskPage() {
  const [mode, setMode] = useState(null); // null | "manual" | "file"

  const [taskData, setTaskData] = useState({
    title: "",
    user_name: "",
    languages: "",
    description: "",
    groups: "",
    price: 0,
    code: "",
    file: null,
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (mode === "manual") {
      const response = await fetch("http://localhost:8000/api/tasks/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskData.title,
          user_name: taskData.user_name,
          languages: taskData.languages,
          description: taskData.description,
          groups: taskData.groups,
          price: taskData.price,
          code: taskData.code,
        }),
      });
      const data = await response.json();
      console.log("Task added (manual):", data);
    } else if (mode === "file") {
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("user_name", taskData.user_name);
      formData.append("languages", taskData.languages);
      formData.append("description", taskData.description);
      formData.append("groups", taskData.groups);
      formData.append("price", taskData.price);
      if (taskData.file) formData.append("file", taskData.file);

      const response = await fetch(
        "http://localhost:8000/api/tasks/add-task-file",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      console.log("Task added (file):", data);
    }
  };

  // Avant de choisir un mode
  if (!mode) {
    return (
      <div>
        <Navbar />
        <div className="add-task-container">
          <h1 className="add-task-title">Add Task</h1>
          <div className="add-task-mode-select">
            <button
              className="add-task-mode-btn"
              onClick={() => setMode("manual")}
            >
              Write Code Manually
            </button>
            <button
              className="add-task-mode-btn"
              onClick={() => setMode("file")}
            >
              Upload a File
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="add-task-container">
        <div className="add-task-header">
          <h1 className="add-task-title">
            {mode === "manual" ? "Add Task — Manual" : "Add Task — File"}
          </h1>
          <button className="add-task-back-btn" onClick={() => setMode(null)}>
            ← Change method
          </button>
        </div>

        <div className="add-task-card">
          <div className="add-task-field">
            <label className="add-task-label">Title *</label>
            <input
              className="add-task-input"
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">User Name *</label>
            <input
              className="add-task-input"
              type="text"
              name="user_name"
              value={taskData.user_name}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Languages</label>
            <input
              className="add-task-input"
              type="text"
              name="languages"
              value={taskData.languages}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Description</label>
            <textarea
              className="add-task-textarea"
              name="description"
              value={taskData.description}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Groups</label>
            <input
              className="add-task-input"
              type="text"
              name="groups"
              value={taskData.groups}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Price *</label>
            <input
              className="add-task-input"
              type="number"
              name="price"
              value={taskData.price}
              onChange={(e) =>
                setTaskData({ ...taskData, price: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Dernier champ qui change selon le mode */}
          {mode === "manual" ? (
            <div className="add-task-field">
              <label className="add-task-label">Code *</label>
              <textarea
                className="add-task-textarea"
                name="code"
                value={taskData.code}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="add-task-field">
              <label className="add-task-label">File *</label>
              <input
                className="add-task-input"
                type="file"
                onChange={(e) =>
                  setTaskData({ ...taskData, file: e.target.files[0] || null })
                }
              />
            </div>
          )}

          <button className="add-task-btn" type="button" onClick={handleSubmit}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskPage;
