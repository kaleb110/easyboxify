"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} className="rounded-lg" />
            <span className="hidden font-bold sm:inline-block">
              BookmarkPro
            </span>
          </Link>
          <nav className="items-center hidden space-x-6 text-sm font-medium md:flex">
            <a className="transition-colors hover:text-primary" href="#features">Features</a>
            <a className="transition-colors hover:text-primary" href="#pricing">Pricing</a>
            <a className="transition-colors hover:text-primary" href="#about">About</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your <span className="text-primary">Bookmarks</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Organize, access, and sync your bookmarks across all devices with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="rounded-full">Get Started</Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-3xl font-bold tracking-tighter text-center sm:text-5xl">Features</h2>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-bold">Minimalist Bookmark Manager</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Clean and intuitive interface for effortless bookmark organization.
                </p>
                <ul className="grid gap-2">
                  {['Simple drag-and-drop interface', 'Customizable categories and tags', 'Quick search functionality'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Minimalist Bookmark Manager"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="grid gap-12 mt-12 lg:grid-cols-2">
              <div className="relative order-last overflow-hidden rounded-lg shadow-xl lg:order-first">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Sync Across Devices"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-bold">Sync Across Devices</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Access your bookmarks anywhere, anytime, on any device.
                </p>
                <ul className="grid gap-2">
                  {['Real-time synchronization', 'Offline access to saved bookmarks', 'Secure cloud storage'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 bg-gray-100 md:py-24 lg:py-32 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-3xl font-bold tracking-tighter text-center sm:text-5xl">Pricing Plans</h2>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {[
                {
                  title: "Free Plan",
                  description: "Perfect for getting started",
                  price: "$0",
                  features: [
                    "Up to 100 bookmarks",
                    "Basic folder organization",
                    "Access on 2 devices"
                  ],
                  buttonText: "Get Started"
                },
                {
                  title: "Pro Plan",
                  description: "For power users and teams",
                  price: "$9.99/mo",
                  features: [
                    "Unlimited bookmarks",
                    "Advanced folder and tag system",
                    "Sync across unlimited devices",
                    "Import/Export Chrome bookmarks",
                    "Priority support"
                  ],
                  buttonText: "Upgrade to Pro"
                }
              ].map((plan, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-4xl font-bold">{plan.price}</div>
                    <ul className="grid gap-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full rounded-full">{plan.buttonText}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=24&width=24" alt="Logo" width={24} height={24} className="rounded" />
              <span className="font-bold">BookmarkPro</span>
            </div>
            <nav className="flex gap-4 text-sm">
              <Link className="transition-colors hover:text-primary" href="#features">
                Features
              </Link>
              <Link className="transition-colors hover:text-primary" href="#pricing">
                Pricing
              </Link>
              <Link className="transition-colors hover:text-primary" href="/landing/about">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link className="text-sm text-gray-500 hover:text-primary" href="/landing/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="text-sm text-gray-500 hover:text-primary" href="/landing/terms-of-service">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}