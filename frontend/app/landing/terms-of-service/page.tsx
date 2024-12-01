import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Welcome to BookmarkPro. By using our services, you agree to be bound by the following Terms of Service. Please read them carefully.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using BookmarkPro, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
        <p>
          BookmarkPro provides a bookmark management service that allows users to save, organize, and access their bookmarks across multiple devices.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
        <p>
          You retain all rights to the content you add to BookmarkPro. By using our service, you grant us a license to use, store, and copy that content in connection with providing our service.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
        <p>
          You agree not to use BookmarkPro for any unlawful purpose or in any way that could damage, disable, overburden, or impair our service.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes by posting a notice on our website.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at legal@bookmarkpro.com.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}