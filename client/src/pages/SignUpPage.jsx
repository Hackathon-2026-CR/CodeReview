import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div style={styles.container}>
      <SignUp routing="path" path="/sign-up" />
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
