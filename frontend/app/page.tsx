"use client"
import BookmarkingAppComponent from "@/components/bookmark/app-bookmark";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthInit } from "@/hooks/useAuthInit";
import { UpgradeModal } from "@/components/custom/upgradeModal";
import useAuthValidation from "@/hooks/useAuthValidation";

export default function Home() {
  useAuthInit()
  useAuthValidation()
  return (
    <ProtectedRoute>
      <UpgradeModal />
      <BookmarkingAppComponent />
    </ProtectedRoute>
  );
}
