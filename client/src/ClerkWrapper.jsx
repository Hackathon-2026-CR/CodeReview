import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing Publishable Key')
}

export default function ClerkWrapper() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  )
}
