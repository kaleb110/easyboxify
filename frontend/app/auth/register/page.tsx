import React from 'react'
import { Suspense } from 'react'
import RegisterPreview from '@/components/auth/register'
const page = () => {
  return (
    <Suspense>
      <RegisterPreview />
    </Suspense>
  )
}

export default page