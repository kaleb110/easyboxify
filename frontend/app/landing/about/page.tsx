import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About EasyBoxify</h1>
      <div className="space-y-6">
        <p>
          EasyBoxify is a cutting-edge bookmark management solution designed to simplify your digital life.
          Our mission is to provide a seamless, intuitive platform for organizing and accessing your favorite web content across all devices.
        </p>
        <p>
          Founded in 2023, EasyBoxify has quickly become a favorite among professionals, students, and casual internet users alike.
          Our team of dedicated developers and designers work tirelessly to ensure that EasyBoxify remains at the forefront of bookmark management technology.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Core Values</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Simplicity in design and functionality</li>
          <li>User privacy and data security</li>
          <li>Continuous innovation and improvement</li>
          <li>Responsive customer support</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          We value your feedback and are always here to help. If you have any questions, suggestions, or concerns, please don&apos;t hesitate to reach out to us at:
        </p>
        <p className="font-semibold">support@EasyBoxify.com</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}