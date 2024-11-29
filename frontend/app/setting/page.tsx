'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Menu, User, HelpCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import axiosClient from '@/util/axiosClient'
import { useBookmarkStore } from '@/store/bookmarkStore'

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(5, { message: "Password must be at least 5 characters." }),
  newPassword: z.string().min(5, { message: "Password must be at least 5 characters." }),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { userName, userEmail, setUserInfo } = useBookmarkStore()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      await setUserInfo()
      // Update form values after fetching user info
      profileForm.reset({
        name: userName,
        email: userEmail,
      })
    }

    fetchData()
  }, [profileForm, setUserInfo, userName, userEmail])

  

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormValues) => {
    // Implement profile update logic here
    const response = await axiosClient.put("/api/user", data)


    console.log('Profile updated:', response)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    // Implement password change logic here
    const response = await axiosClient.put("/api/user/change-password", data)

    console.log('Password changed:', response)
    setIsPasswordDialogOpen(false)
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
  }

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ]

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Settings
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
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
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account settings and set email preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  {/* name field */}
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email field */}
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and a new password to update your account.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          {/* current password */}
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* new password */}
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Update Password</Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button type="submit">Save Profile Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )
      case 'help':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Help</CardTitle>
              <CardDescription>Get assistance and support for using our app.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>If you need help, please check our FAQ or contact our support team.</p>
              <ul className="list-disc pl-5 mt-2">
                <li>How do I create a new bookmark?</li>
                <li>Can I organize my bookmarks into folders?</li>
                <li>How do I share my bookmarks with others?</li>
                <li>Is there a limit to how many bookmarks I can save?</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Contact Support</Button>
            </CardFooter>
          </Card>
        )
      case 'about':
        return (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Learn more about our app and its features.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our app is designed to help you manage your bookmarks efficiently and effectively.</p>
              <h3 className="font-semibold mt-4 mb-2">Key Features:</h3>
              <ul className="list-disc pl-5">
                <li>Easy bookmark organization with folders and tags</li>
                <li>Quick search and filter options</li>
                <li>Sync across multiple devices</li>
                <li>Secure and private bookmark storage</li>
                <li>Regular updates and new features</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Check for Updates</Button>
            </CardFooter>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle settings menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Settings Menu</SheetTitle>
              <SheetDescription>
                Navigate through different settings options
              </SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Card>
            <CardContent>
              <SidebarContent />
            </CardContent>
          </Card>
        </aside>

        <main className="flex-grow">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}