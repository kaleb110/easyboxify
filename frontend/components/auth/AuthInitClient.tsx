"use client";

import { useAuthInit } from "@/store/useAuthStore";

export default function AuthInitClient() {
  useAuthInit();
  return null; // This component doesn't render anything, it's just for side effects
}
