import { SignIn } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) {
      navigate('/')
    }
  }, [isSignedIn, navigate])

  return (
    <div style={styles.container}>
      <SignIn redirectUrl="/" />
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}
