import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "../styles/AddTaskPage.css";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function AddTaskPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("file");
  const [fileKey, setFileKey] = useState(0);
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    user_name: localStorage.getItem("username") || "",
    price: 0,
    languages: "",
    description: "",
    groups: "public",
    code: "",
    file: null,
  });

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

  const resetForm = () => {
    setTaskData({
      title: "",
      user_name: localStorage.getItem("username") || "",
      languages: "",
      description: "",
      groups: "public",
      price: 0,
      code: "",
      file: null,
    });
    setFileKey((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (
      !taskData.title ||
      !taskData.user_name ||
      !taskData.languages ||
      !taskData.price ||
      (mode === "manual" && !taskData.code) ||
      (mode === "file" && !taskData.file)
    ) {
      toast.error(
        `Please fill all required fields: Title, Languages, Price${mode === "manual" ? ", Code" : ", File"}`,
      );
      return;
    }

    if (
      mode === "file" &&
      taskData.file &&
      taskData.file.size > 5 * 1024 * 1024
    ) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    if (taskData.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("user_name", taskData.user_name);
      formData.append("languages", taskData.languages);
      formData.append("description", taskData.description);
      formData.append("groups", taskData.groups);
      formData.append("price", taskData.price);

      if (mode === "file") {
        formData.append("file", taskData.file);
      } else {
        formData.append("code", taskData.code);
      }

      const response = await api.postForm("/api/tasks/add-task", formData);

      if (response.status === 400) {
        toast.error("Invalid data. Please check your inputs.");
        return;
      }
      if (response.status === 401) {
        toast.error("You are not logged in.");
        return;
      }
      if (!response.ok) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      resetForm();
      toast.success("Task added successfully! Redirecting...");
      setTimeout(() => navigate("/my-tasks"), 1500);
    } catch {
      toast.error("Network error. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="add-task-container">
        <h1 className="add-task-title">Add New Task</h1>

        <div className="add-task-card">
          <div className="add-task-field">
            <label className="add-task-label">Title *</label>
            <input
              className="add-task-input"
              name="title"
              value={taskData.title}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">User Name</label>
            <input
              className="add-task-input"
              name="user_name"
              value={taskData.user_name}
              readOnly
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Languages *</label>
            <input
              className="add-task-input"
              name="languages"
              value={taskData.languages}
              onChange={handleChange}
              placeholder="e.g. JavaScript, Python"
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
              name="groups"
              value={taskData.groups}
              onChange={handleChange}
              placeholder="e.g. public, premium"
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Credits *</label>
            <input
              type="number"
              className="add-task-input"
              name="price"
              value={taskData.price === 0 ? "" : taskData.price}
              placeholder="e.g. 12"
              onChange={handleChange}
            />
          </div>

          <div className="add-task-field">
            <label className="add-task-label">Type *</label>
            <select
              className="add-task-input"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="file">Upload File</option>
              <option value="manual">Manual Code</option>
            </select>
          </div>

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
                key={fileKey}
                type="file"
                className="add-task-input"
                name="file"
                onChange={handleChange}
              />
              {taskData.file && (
                <p className="add-task-file-name">
                  Selected: {taskData.file.name}
                </p>
              )}
            </div>
          )}

          <div className="add-task-bottom">
            <button
              className="add-task-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
