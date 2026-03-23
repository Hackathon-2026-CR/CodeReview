import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/AccountInfosPage.css";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./AccountPage.css";

const READ_ONLY_FIELDS = ["rating", "credits", "list_of_codes"];

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setError("You are not logged in. Please log in first.");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (response.status === 404) {
          setError("This account does not exist.");
          return;
        }
        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          return;
        }
        if (response.status === 403) {
          setError("You do not have permission to view this account.");
          return;
        }
        if (!response.ok) {
          setError("Something went wrong. Please try again later.");
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Network error. Check your internet connection.");
      }
    };

    fetchUser();
  }, []);

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(
      Array.isArray(currentValue) ? currentValue.join(", ") : currentValue,
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
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          field,
          value: newValue,
        }),
      });

      if (!response.ok) {
        alert("Failed to update. Please try again.");
        return;
      }

      setUser((prev) => ({ ...prev, [field]: newValue }));
      setEditingField(null);
    } catch (err) {
      alert("Network error. Could not save changes.");
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
                  {value.length === 0 ? (
                    <span className="account-value">None</span>
                  ) : (
                    value.map((v) => (
                      <span key={v} className="account-tag">
                        {v}
                      </span>
                    ))
                  )}
                </div>
              ) : field === "password" ? (
                <span className="account-value">
                  {"•".repeat(value.length)}
                </span>
              ) : field === "price" ? (
                <span className="account-value">${value}</span>
              ) : field === "rating" ? (
                <span className="account-value">{value} / 5</span>
              ) : (
                <span className="account-value">{value}</span>
              )}
              {isReadOnly ? null : (
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
      <Navbar />
      <div className="account-container">
        <h1 className="account-title">Account Information</h1>
        <div className="account-card">
          {renderRow("Name", "name")}
          {renderRow("Password", "password")}
          {renderRow("Credits", "credits")}
          {renderRow("Price", "price")}
          {renderRow("Rating", "rating")}
          {renderRow("Groups", "groups")}
          {renderRow("Code Languages", "code_languages")}
          {renderRow("List of Codes", "list_of_codes")}
        </div>
      </div>
    </div>
  );
}
