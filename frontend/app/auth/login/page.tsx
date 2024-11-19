import React from 'react'
import { Suspense } from 'react'
import LoginPreview from '@/components/auth/login'
const page = () => {
  return (
    <Suspense>
      <LoginPreview />
    </Suspense>
  )
}

export default page