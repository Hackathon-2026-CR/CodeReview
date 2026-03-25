import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AllTasksPage from './pages/AllTasksPage'
import MyTasksPage from './pages/MyTasksPage'
import AddTaskPage from './pages/AddTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import AccountPage from './pages/AccountInfosPage'

function App() {
  return (
    <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <HomePage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-tasks"
            element={
              <ProtectedRoute>
                <>
                  <AllTasksPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <>
                  <MyTasksPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <>
                  <AddTaskPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-details/:id"
            element={
              <ProtectedRoute>
                <>
                  <TaskDetailsPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
