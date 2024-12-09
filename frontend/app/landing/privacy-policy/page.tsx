"use client"
import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPolicy() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <ScrollArea className="h-[calc(100vh-4rem)] pr-4">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy for EasyBoxify</h1>
        <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p className="mb-4">
            Welcome to EasyBoxify. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our EasyBoxify service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us when you:</p>
          <ul className="pl-6 mb-4 list-disc">
            <li>Create an account</li>
            <li>Use our service to save and organize bookmarks</li>
            <li>Contact our customer support</li>
            <li>Respond to surveys or communications</li>
          </ul>
          <p className="mb-4">This information may include:</p>
          <ul className="pl-6 mb-4 list-disc">
            <li>Name</li>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Bookmarks and associated metadata (URLs, titles, descriptions, tags)</li>
            <li>Usage data (e.g., features used, frequency of use)</li>
            <li>Device information (e.g., IP address, browser type, operating system)</li>
          </ul>
        </section>

        {/* Add more sections here for the rest of the privacy policy content */}

        {/* <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>EasyBoxify</p>
          <p>Email: privacy@easyboxify.com</p>
        </section> */}
      </ScrollArea>
    </div>
  )
}