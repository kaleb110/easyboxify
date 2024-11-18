import BookmarkingAppComponent from "@/components/bookmark/app-bookmark";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function Home() {
  return (
    <ProtectedRoute>
      <BookmarkingAppComponent />
    </ProtectedRoute>
  );
}
