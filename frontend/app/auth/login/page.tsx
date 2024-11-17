'use client'

import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import axiosClient from '@/util/axiosClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
})

export default function LoginPreview() {
  const { setIsAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationMessage, setVerificationMessage] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Function to handle login form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password } = values
      console.log(values)
      const response = await axiosClient.post("/auth/login", {
        email,
        password
      })

      const { token } = response.data

      localStorage.setItem("authToken", token)

      toast({
        title: 'Success!',
        description: 'Login successful.',
        variant: 'default', // Customize the variant if needed
      })

      setIsAuthenticated(true)
      router.push("/")
      console.log("Login successful.", response)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Login failed!',
        variant: 'destructive',
      })
      console.error('Login failed', error)
    }
  }

  // Check if there is a token in the URL for email verification
  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      const verifyEmail = async () => {
        try {
          // Make the verification request to the backend
          await axiosClient.post('/auth/verify-email', { token })
          setVerificationMessage('Email verified successfully! You can now log in.')

          // Show success message
          toast({
            title: 'Email Verified',
            description: 'Email verified successfully! You can now log in.',
            variant: 'default',
          })

        } catch (error) {
          // In case of error, show the error message
          setVerificationMessage('Verification failed. Please try again.')

          toast({
            title: 'Verification Error',
            description: 'Verification failed. Please try again.',
            variant: 'destructive',
          })
        }
      }

      // Call the verification function
      verifyEmail()
    }
  }, [searchParams, toast])

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationMessage && (
            <div className="mb-4 text-center text-sm text-green-600">
              {verificationMessage}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="/auth/forgot"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
