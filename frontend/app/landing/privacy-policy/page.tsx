import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          At BookmarkPro, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our bookmark management service.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Account information (e.g., name, email address)</li>
          <li>Bookmark data (URLs, titles, tags, folders)</li>
          <li>Usage information (e.g., features used, time spent on the app)</li>
          <li>Device information (e.g., browser type, operating system)</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide and improve our services</li>
          <li>To personalize your experience</li>
          <li>To communicate with you about your account and our services</li>
          <li>To ensure the security and integrity of our platform</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your information with third-party service providers who help us operate our business, but only as necessary to provide our services to you.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
        <p>
          You have the right to access, correct, or delete your personal information. You can also opt out of certain data collection and use. To exercise these rights, please contact us at privacy@bookmarkpro.com.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
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