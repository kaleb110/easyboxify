"use client"
import React, { useEffect } from 'react'
import { Suspense } from 'react'
import LoginPreview from '@/components/auth/login'
import axiosClient from '@/util/axiosClient'

const LoginPage = () => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await axiosClient.post("/auth/logout"); // API call to clear the cookie
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    performLogout();
  }, [])
  return (
    <Suspense>
      <LoginPreview />
    </Suspense>
  )
}

export default LoginPage