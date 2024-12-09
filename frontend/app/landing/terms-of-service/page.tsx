"use client"
import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsOfService() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <ScrollArea className="h-[calc(100vh-4rem)] pr-4">
        <h1 className="mb-6 text-3xl font-bold">Terms of Service for EasyBoxify</h1>
        <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the EasyBoxify service, you agree to be bound by these Terms of Service (&quot;Terms&quot;).
            If you do not agree to these Terms, you may not use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
          <p className="mb-4">
            EasyBoxify provides a platform for users to save, organize, and sync bookmarks across devices (&quot;Service&quot;).
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. User Accounts</h2>
          <p className="mb-4">3.1. You must create an account to use certain features of the Service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
          <p className="mb-4">3.2. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          <p className="mb-4">3.3. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.</p>
        </section>

        {/* Add more sections here for the rest of the terms of service content */}

        {/* <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">12. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
          <p>EasyBoxify</p>
          <p>Email: legal@EasyBoxify.com</p>
          <p>Address: [Your Company Address]</p>
        </section> */}
      </ScrollArea>
    </div>
  )
}