import React from 'react'
import { Suspense } from 'react'
import RegisterPreview from '@/components/auth/register'
import { Loader2 } from 'lucide-react'
const page = () => {
  return (
    <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
      <RegisterPreview />
    </Suspense>
  )
}

export default page