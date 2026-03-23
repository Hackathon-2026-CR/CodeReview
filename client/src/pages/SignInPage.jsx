import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div style={styles.container}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#1e1e2e',
  },
}
