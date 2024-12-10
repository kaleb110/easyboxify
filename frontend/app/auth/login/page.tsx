import { Metadata } from 'next'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: 'login',
  description: 'metadata for login',
}

const LogIn = () => <LoginPage />

export default LogIn