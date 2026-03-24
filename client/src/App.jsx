import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AllTasksPage from './pages/AllTasksPage'
import MyTasksPage from './pages/MyTasksPage'
import AddTaskPage from './pages/AddTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-tasks" element={<AllTasksPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/task-details/:id" element={<TaskDetailsPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
