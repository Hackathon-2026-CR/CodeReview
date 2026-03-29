import { useState, useEffect } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import "../styles/AccountInfosPage.css";
import toast, { Toaster } from "react-hot-toast";

const READ_ONLY_FIELDS = ["rating", "credits", "name"];

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchUser = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("You are not logged in. Please log in first.");
      return;
    }
    try {
      const response = await api.get(`/api/users/${username}`);
      if (!response.ok) {
        setError("Something went wrong. Please try again later.");
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch {
      setError("Network error. Check your internet connection.");
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("focus", fetchUser);
    return () => window.removeEventListener("focus", fetchUser);
  }, []);

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(
      Array.isArray(currentValue)
        ? currentValue.join(", ")
        : (currentValue ?? ""),
    );
  };

  const handleSave = async (field) => {
    const isArray = Array.isArray(user[field]);
    const newValue = isArray
      ? editValue
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : editValue;

    try {
      const response = await api.post("/api/users/update-user", {
        name: localStorage.getItem("username"),
        [field]: newValue,
      });

      if (!response.ok) {
        toast.error("Server error. Could not save changes.");
        return;
      }

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setUser((prev) => ({ ...prev, [field]: newValue }));
      setEditingField(null);
      toast.success("Field updated successfully!");
    } catch {
      toast.error("Network error. Could not save changes.");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const renderRow = (label, field) => {
    const value = user[field];
    const isEditing = editingField === field;
    const isArray = Array.isArray(value);
    const isReadOnly = READ_ONLY_FIELDS.includes(field);

    return (
      <div className="account-row" key={field}>
        <span className="account-label">{label}</span>
        <div className="account-edit-wrapper">
          {isEditing ? (
            <>
              <input
                className="account-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={isArray ? "comma separated" : ""}
                autoFocus
              />
              <button
                className="account-save-btn"
                onClick={() => handleSave(field)}
              >
                Save
              </button>
              <button className="account-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              {isArray ? (
                <div className="account-tag-container">
                  {!value || value.length === 0 ? (
                    <span className="account-value account-empty">None</span>
                  ) : (
                    value.map((v) => (
                      <span key={v} className="account-tag">
                        {v}
                      </span>
                    ))
                  )}
                </div>
              ) : field === "rating" ? (
                <span className="account-value">{value ?? "—"} / 5</span>
              ) : (
                <span className="account-value">{value ?? "—"}</span>
              )}
              {!isReadOnly && (
                <button
                  className="account-edit-btn"
                  onClick={() => handleEdit(field, value)}
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (error)
    return (
      <div>
        <Navbar />
        <div className="account-error">{error}</div>
      </div>
    );

  if (!user)
    return (
      <div>
        <Navbar />
        <div className="account-loading">Loading...</div>
      </div>
    );

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="account-container">
        <h1 className="account-title">Account Information</h1>
        <div className="account-card">
          {renderRow("Name", "name")}
          {renderRow("Email", "email")}
          {renderRow("Credits", "credits")}
          {renderRow("Rating", "rating")}
          {renderRow("Groups", "groups")}
          {renderRow("Code Languages", "languages")}
        </div>
      </div>
    </div>
  );
}
