import React from 'react'

function AddTaskPage() {

    const [newTask, setNewTask] = React.useState({title: '', description: ''})

    const addTask = async () => {
        try {
            const response = await fetch('/api/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            })
            const data = await response.json()
            console.log('Task added:', data)
        } catch (error) {
            console.error('Error adding task:', error)
        }
    }


  return (
    <div>
        <h1>Add Task</h1>
        <form>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
            </div>
            <button type="button" onClick={addTask}>
                Add Task
            </button>
        </form>
    </div>
  )
}

export default AddTaskPage