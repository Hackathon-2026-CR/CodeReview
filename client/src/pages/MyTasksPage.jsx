import React, { use } from 'react'
import {useNavigate} from 'react-router-dom'

function MyTasksPage() {

    const [myTasks, setMyTasks] = React.useState([])
    const [workingTasks, setWorkingTasks] = React.useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // endpoint 2 : "/api/tasks/my-tasks", POST, body: username, response: list of tasks created by the user
                const response = await fetch('/api/tasks/my-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: localStorage.getItem('username') })
                }) 
                const data = await response.json()
                setMyTasks(data)
            } catch (error) {
                console.error('Error fetching my tasks:', error)
            }
        };

        fetchTasks();
    }, []);


    useEffect(() => {
        const fetchWorkingTasks = async () => {
            try {
                // endpoint 3 : "/api/tasks/working-tasks", POST, body: username, response: list of tasks the user is currently working on
                const response = await fetch('/api/tasks/working-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: localStorage.getItem('username') })
                }) ////
                const data = await response.json()
                setWorkingTasks(data)
            } catch (error) {
                console.error('Error fetching working tasks:', error)
            }
        };

        fetchWorkingTasks();
    }, []);


  return (
    <div className='my-tasks-page'>
        <div>
            <h1>Tasks I'm working on :</h1>
            <ul>
                {workingTasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>

        <div className='my-tasks-container'>
            <h1>My Tasks :</h1>
            <ul>
                {myTasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
        <div className='add-task'>
            <button onClick={() => navigate('/add-task')}>Add Task</button>
        </div>
    </div>
  )
}

export default MyTasksPage