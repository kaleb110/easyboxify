import React from 'react'
import { Suspense } from 'react'
import ResetPasswordPreview from '@/components/auth/reset'
import { Loader2 } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'reset',
  description: 'Metadata for reset password',
}

const page = () => {
  return (
    <Suspense fallback={<Loader2 className="w-4 h-4 mr-2 animate-spin" />}>
      <ResetPasswordPreview />
    </Suspense>
  )
}

export default page