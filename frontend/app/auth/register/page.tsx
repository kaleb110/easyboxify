import React from 'react'
import { Suspense } from 'react'
import RegisterPreview from '@/components/auth/register'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'register',
  description: 'Metadata for register',
}

const page = () => {
  return (
    <Suspense>
      <RegisterPreview />
    </Suspense>
  )
}

export default page