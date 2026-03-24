import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AllTasksPage from './pages/AllTasksPage'
import MyTasksPage from './pages/MyTasksPage'
import AddTaskPage from './pages/AddTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import AccountInfosPage from './pages/AccountInfosPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

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
                  <Navbar />
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
                  <Navbar />
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
                  <Navbar />
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
                  <Navbar />
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
                  <Navbar />
                  <TaskDetailsPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountInfosPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
