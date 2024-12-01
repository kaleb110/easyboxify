"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axiosClient from '@/util/axiosClient'
import { useToast } from "@/hooks/use-toast"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Loader2 } from "lucide-react"

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
const Profile = () => {
  const { Logout } = useAuthStore();
  const { userName, userEmail, setUserInfo } = useBookmarkStore()
  const { toast } = useToast()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await setUserInfo()
      // Update form values after fetching user info
      profileForm.reset({
        name: userName,
        email: userEmail,
      })
      setIsLoading(false)
    }

    fetchData()
  }, [profileForm, setUserInfo, userName, userEmail])

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    // Implement profile update logic here
    const response = await axiosClient.put("/api/user", data)
    setIsLoading(false)

    console.log('Profile updated:', response)

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true)
    // Implement password change logic here
    const response = await axiosClient.put("/api/user/change-password", data)
    setIsLoading(false)

    console.log('Password changed:', response)

    setIsPasswordDialogOpen(false)
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
  }

  const handleLogout = () => {
    Logout(); // This will clear the authentication state and token
    router.replace('/auth/login'); 
};

  const handleDeleteBookmarks = async () => {
    try {
      await axiosClient.delete('/api/delete-data')
      toast({
        title: "Bookmarks Deleted",
        description: "All your bookmarks have been successfully deleted.",
      })
    } catch (error) {
      console.error('Delete bookmarks failed:', error)
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting bookmarks.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axiosClient.delete('/api/user')
      Logout(); // This will clear the authentication state and token
      router.replace('/auth/login');
    } catch (error) {
      console.error('Delete account failed:', error)
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting your account.",
        variant: "destructive",
      })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your account settings and set email preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
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
            <div className="flex flex-wrap gap-4">
              {/* change password */}
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
              {/* save changes */}
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile Changes"}</Button>

            </div>
            <div className='flex flex-col gap-2'>
              {/* logout */}
              <div>
                <Button variant="outline" onClick={handleLogout} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Logout"}</Button>
              </div>
              {/* delete bookmark */}
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Bookmarks</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your bookmarks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteBookmarks} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete All Bookmarks"}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {/* delete account */}
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Account"}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Profile