import { Metadata } from 'next'
import SettingsPage from '@/components/custom/SettingsPage'

export const metadata: Metadata = {
  title: 'setting',
  description: 'metadata for setting',
}

const Setting = () => <SettingsPage />

export default Setting