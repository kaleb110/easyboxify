import React from 'react'
import { Suspense } from 'react'
import ForgetPasswordPreview from '@/components/auth/forgot'
const page = () => {
  return (
    <Suspense>
      <ForgetPasswordPreview />
    </Suspense>
  )
}

export default page