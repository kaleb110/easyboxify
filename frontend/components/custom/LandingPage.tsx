"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle2, ArrowRight, Menu, Play, Pause } from 'lucide-react'
import { Logo } from "@/components/custom/Logo"
import CookieBanner from '@/components/custom/CookieBanner'


export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
  ]

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error('Error autoplaying video:', error))
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <a className="flex items-center space-x-2" href="#">
            <Logo className="w-6 h-6" />
            <span className="font-bold">EasyBoxify</span>
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </a>
          <nav className="items-center hidden space-x-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <a key={item.href} className="transition-colors hover:text-primary" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <div className="hidden space-x-2 md:flex">
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign up</Button>
              </Link>
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full ">Log in</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:pb-32 xl:pb-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your <span className="text-primary">Bookmarks</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Organize, access, and sync your bookmarks across all devices with ease.
                </p>
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register">
                  <Button size="lg" className="rounded-full">Get Started</Button>
                </Link>
                <Button variant="outline" size="lg" className="rounded-full" disabled={true}>
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="w-full max-w-4xl mx-auto mt-8">
                <div className="relative w-full overflow-hidden rounded-lg">
                  <video
                    ref={videoRef}
                    className="object-cover w-full h-full rounded-lg"
                    playsInline
                    muted
                    loop
                  >
                    <source src="/intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 left-4"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 mx-auto md:px-6">
            <h2 className="mb-12 text-3xl font-bold tracking-tighter text-center sm:text-5xl">Features</h2>
            <div className="space-y-24">
              {/* First Feature */}
              <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold">Minimalist Bookmark Manager</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Clean and intuitive interface for effortless bookmark organization.
                  </p>
                  <ul className="grid gap-2">
                    {['Simple bookmark saving', 'Customizable folders and tags', 'Quick search functionality'].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex-1 rounded-lg">
                  <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                    <Image
                      src="https://utfs.io/f/EwD0sHYT6rXki0XOSnWTZQibgIsBqt5Kwj1OYH2PvMA8Sl6k"
                      alt="Minimalist Bookmark Manager"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Second Feature */}
              <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-12">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold">Sync Across Devices</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access your bookmarks anywhere, anytime, on any device.
                  </p>
                  <ul className="grid gap-2">
                    {['Real-time synchronization across all devices', 'Import bookmarks from Chrome', 'Secure cloud storage'].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex-1 rounded-lg">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="https://utfs.io/f/EwD0sHYT6rXkkixcimtJUR7hCz6n95EFcjlr4fqdHuywDLPv"
                      alt="Minimalist Bookmark Manager"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 bg-gray-100 md:py-24 lg:py-32 dark:bg-gray-800">
          <div className="container px-4 mx-auto text-center md:px-6">
            <h2 className="mb-12 text-3xl font-bold tracking-tighter text-center sm:text-5xl">Pricing Plans</h2>
            <div className="grid max-w-4xl gap-8 mx-auto lg:grid-cols-2 lg:gap-12">
              {[
                {
                  title: "Free Plan",
                  description: "Perfect for getting started",
                  price: "$0",
                  features: [
                    "Up to 100 bookmarks",
                    "Basic folder and tag organization",
                    "Access on 2 devices"
                  ],
                  buttonText: "Get Started"
                },
                {
                  title: "Pro Plan",
                  description: "For power users and teams",
                  price: "$2.99/mo",
                  features: [
                    "Unlimited bookmarks",
                    "unlimited folders and tags",
                    "Sync across unlimited devices",
                    "Import/Export Chrome bookmarks",
                    "Priority support",
                    "New features"
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
                          <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.buttonText === "Upgrade to Pro" ?
                      <Button
                        disabled={true}
                        className="w-full rounded-full">{plan.buttonText}
                      </Button> :
                      <Button className="w-full rounded-full">{plan.buttonText}
                      </Button>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <Logo className="w-6 h-6" />
              <span className="font-bold">EasyBoxify</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} className="transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap justify-center gap-4">
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
      <CookieBanner />
    </div>
  )
}

