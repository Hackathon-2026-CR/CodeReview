import React, { useState } from "react";
import "../styles/AddTaskPage.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddTaskPage() {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    user_name: "",
    languages: "",
    description: "",
    groups: "",
    price: 0,
    code: "",
    file: null,
    mode: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setTaskData({ ...taskData, file: files[0] || null });
    } else if (name === "price") {
      setTaskData({ ...taskData, price: parseInt(value) || 0 });
    } else {
      setTaskData({ ...taskData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!taskData.title || !taskData.user_name || !taskData.price) {
      alert("Please fill in all required fields: Title, User Name, Price.");
      return;
    }

    setLoading(true);

    const url =
      taskData.mode === "file"
        ? "http://localhost:8000/api/tasks/add-task-file"
        : "http://localhost:8000/api/tasks/add-task";

    const body =
      taskData.mode === "file"
        ? (() => {
            const formData = new FormData();
            Object.entries(taskData).forEach(([key, value]) => {
              if (value && key !== "mode") formData.append(key, value);
            });
            return formData;
          })()
        : JSON.stringify({
            ...taskData,
            file: undefined,
            mode: undefined,
          });

    const headers =
      taskData.mode === "manual" ? { "Content-Type": "application/json" } : {};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });
      const data = await response.json();

      setTaskData({
        title: "",
        user_name: "",
        languages: "",
        description: "",
        groups: "",
        price: 0,
        code: "",
        file: null,
        mode: taskData.mode,
      });

      alert("Task added successfully!");
      navigate("/all-tasks");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Error adding task!");
    } finally {
      setLoading(false);
    }
  };

  if (!taskData.mode) {
    return (
      <div>
        <Navbar />
        <div className="add-task-mode-select">
          <h1 className="add-task-mode-title">Add New Task</h1>
          <button
            className="add-task-mode-btn"
            onClick={() => setTaskData({ ...taskData, mode: "manual" })}
          >
            Write Code Manually
          </button>
          <button
            className="add-task-mode-btn"
            onClick={() => setTaskData({ ...taskData, mode: "file" })}
          >
            Upload a File
          </button>
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
            {taskData.mode === "manual"
              ? "Add Task — Manual"
              : "Add Task — File"}
          </h1>
          <button
            className="add-task-back-btn"
            onClick={() => setTaskData({ ...taskData, mode: null })}
          >
            ← Change method
          </button>
        </div>

        <div className="add-task-card">
          {/* Title */}
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

          {/* User Name */}
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

          {/* Languages */}
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

          {/* Description */}
          <div className="add-task-field">
            <label className="add-task-label">Description</label>
            <textarea
              className="add-task-textarea"
              name="description"
              value={taskData.description}
              onChange={handleChange}
            />
          </div>

          {/* Groups */}
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

          {/* Price */}
          <div className="add-task-field">
            <label className="add-task-label">Price *</label>
            <input
              className="add-task-input"
              type="number"
              name="price"
              value={taskData.price}
              onChange={handleChange}
            />
          </div>

          {/* Code ou File */}
          {taskData.mode === "manual" ? (
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
                name="file"
                onChange={handleChange}
              />
              {taskData.file && <p>Selected file: {taskData.file.name}</p>}
            </div>
          )}

          <button
            className="add-task-btn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
