'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, User, HelpCircle, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Profile from './profile/page'
import Help from './help/page'
import About from './about/page'

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ]

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start font-medium text-sm"
              onClick={() => {
                setActiveSection(item.id)
                setIsSidebarOpen(false)
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />
      case 'help':
        return <Help />
      case 'about':
        return <About />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 px-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Button>
            </Link>
            <h2 className="font-semibold text-lg">Settings</h2>
          </div>
          <SidebarContent />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header for small screens */}
        <header className="border-b p-4 md:hidden">
          <div className="flex items-center justify-between">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle settings menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">


                <SheetHeader className="px-4 py-2 border-b flex  items-start justify-between">

                  <SheetTitle className="font-semibold text-lg">
                    <Link href="/">
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                      <ArrowLeft className="h-5 w-5" />
                      <span className="sr-only">Back to home</span>
                    </Button>
                  </Link>
                    <span>Settings</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Scrollable content area */}
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}