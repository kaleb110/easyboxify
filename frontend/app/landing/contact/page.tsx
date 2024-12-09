"use client"
import React from 'react'
import { Logo } from "@/components/custom/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically handle form submission, e.g., send data to an API
    console.log('Form submitted')
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col items-center mb-8">
        <Logo className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold">Contact EasyBoxify</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>We&apos;ll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Your email" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Send Message</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Here are other ways to reach us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <p>123 Bookmark Street, Web City, 12345</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <p>contact@EasyBoxify.com</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">
                We&apos;re available Monday to Friday, 9am to 5pm EST.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { q: "How do I reset my password?", a: "You can reset your password by clicking on the 'Forgot Password' link on the login page." },
            { q: "Can I use EasyBoxify on multiple devices?", a: "Yes, EasyBoxify syncs across all your devices automatically." },
            { q: "Is there a limit to how many bookmarks I can save?", a: "Free accounts can save up to 1000 bookmarks. Premium accounts have unlimited storage." },
            { q: "How secure are my bookmarks?", a: "We use industry-standard encryption to keep your data safe and secure." },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}