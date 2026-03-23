
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import AllTasksPage from './pages/AllTasksPage'
import MyTasksPage from './pages/MyTasksPage'
import AddTaskPage from './pages/AddTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'

function App() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <Router>
      {isSignedIn && <Navbar />}
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-tasks"
          element={
            <ProtectedRoute>
              <AllTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-details/:id"
          element={
            <ProtectedRoute>
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isSignedIn ? '/' : '/sign-in'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
