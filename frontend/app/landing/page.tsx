import { Metadata } from 'next'
import LandingPage from '@/components/custom/LandingPage'

export const metadata: Metadata = {
  title: "Easyboxify - a bookmark app",
  description: "Meta data for landing page",
};


const Landing = () => <LandingPage />

export default Landing