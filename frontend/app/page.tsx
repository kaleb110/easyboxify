"use client"
import BookmarkingAppComponent from "@/components/bookmark/app-bookmark";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthInit } from "@/hooks/useAuthInit";
export default function Home() {
  useAuthInit()
  return (
    <ProtectedRoute>
      <BookmarkingAppComponent />
    </ProtectedRoute>
  );
}
