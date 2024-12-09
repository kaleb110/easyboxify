"use client"
import React from 'react'

interface LogoProps {
  className?: string
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={`w-10 h-10 ${className}`}
      aria-label="EasyBoxify Logo"
    >
      <rect width="100" height="100" rx="20" fill="#3b82f6" />
      <path
        d="M30 20 L70 20 L70 80 L50 60 L30 80 Z"
        fill="white"
        strokeWidth="4"
        stroke="#1d4ed8"
      />
      <circle cx="50" cy="40" r="10" fill="#1d4ed8" />
    </svg>
  )
}