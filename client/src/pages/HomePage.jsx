import React from 'react'

function HomePage() {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                // endpoint 1 : "/api/user", POST, body: username, response: all user info (username, email, etc...)
                const response = await fetch('/api/user',{ 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: localStorage.getItem('username') })
                })
                const data = await response.json()
                setUser(data)
            }
            catch (error) {
                console.error('Error fetching user:', error)
            }
        }

        fetchUser()
    }, [])

  return (
    <div className='home-page'>
        <h1>Welcome to CodeReview app !</h1>
        {user && (
            <div>
                <p>Hello, {user.username}!</p>
                <p>Email: {user.email}</p>
            </div>
        )}
    </div>
  )
}

export default HomePage