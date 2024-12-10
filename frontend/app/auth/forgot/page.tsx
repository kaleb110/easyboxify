import React from 'react'
import { Suspense } from 'react'
import ForgetPasswordPreview from '@/components/auth/forgot'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'forgot',
  description: 'Metadata for frogot password',
}

const page = () => {
  return (
    <Suspense>
      <ForgetPasswordPreview />
    </Suspense>
  )
}

export default page