'use client'

import React, { useState } from 'react'
import { Sparkles, CheckCircle2, Zap, AlertCircle } from 'lucide-react'
import { useUIStore } from '@/store/useUiStore'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosClient from '@/util/axiosClient'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'

interface ErrorResponse {
  error: string;
}

const plans = [
  {
    name: 'Free',
    features: [
      'Up to 3 folders',
      'Up to 3 tags',
      'Up to 100 bookmarks',
    ],
  },
  {
    name: 'Pro',
    features: [
      'Unlimited folders',
      'Unlimited tags',
      'Unlimited bookmarks',
      'Priority support',
      'import/export chrome bookmarks',
      'Early access to new features',
    ],
  },
]

export function UpgradeModal() {
  const { toast } = useToast()
  const { showUpgradeModal, setShowUpgradeModal, errorMessage } = useUIStore()
  const { userPlan, subscriptionStatus } = useBookmarkStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [selectedPlanType, setSelectedPlanType] = useState('monthly')

  const handleClose = () => {
    setShowUpgradeModal(false)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const { data } = await axiosClient.post("/create-checkout-session", {
        userId: 18,
        planType: selectedPlanType,
      })
      window.location.href = data.url
    } catch (error) {
      console.error("Error redirecting to Stripe Checkout:", error)
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsCanceling(true)
    try {
      const response = await axiosClient.post("/cancel-subscription", {
        userId: 18,
      })

      if (response.data.success) {
        toast({
          title: "Subscription Canceled",
          description: "Your subscription will be canceled at the end of the billing period",
          variant: "default",
          duration: 5000,
        })
        useBookmarkStore.setState({ subscriptionStatus: 'canceling' })
        handleClose()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error canceling subscription:", error)
      toast({
        title: "Error",
        description: axiosError.message || "Failed to cancel subscription",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsCanceling(false)
    }
  }

  const renderSubscriptionStatus = () => {
    if (subscriptionStatus === 'canceling') {
      return (
        <div className="flex items-center gap-2 mt-4 mb-2 text-sm text-yellow-500">
          <AlertCircle className="w-4 h-4" />
          <span>Your subscription will be canceled at the end of the billing period</span>
        </div>
      )
    }
    return null
  }

  const renderActionButton = () => {
    if (userPlan === 'free') {
      return (
        <Button
          onClick={handleCheckout}
          className="w-full text-white sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500"
          disabled={isLoading}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isLoading ? "Processing..." : `Upgrade to Pro (${selectedPlanType})`}
        </Button>
      )
    }

    if (subscriptionStatus === 'canceling') {
      return (
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          disabled
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Cancellation Pending
        </Button>
      )
    }

    return (
      <Button
        onClick={handleCancelSubscription}
        variant="destructive"
        className="w-full sm:w-auto"
        disabled={isCanceling}
      >
        <Zap className="w-4 h-4 mr-2" />
        {isCanceling ? "Canceling..." : "Cancel Subscription"}
      </Button>
    )
  }

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] max-h-[90vh] md:max-h-none md:h-auto overflow-y-auto md:overflow-y-visible">
        <DialogHeader className="md:text-center">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold sm:text-2xl md:justify-center">
            <Sparkles className="w-5 h-5 text-yellow-500 sm:h-6 sm:w-6" />
            {userPlan === 'free' ? 'Upgrade to Pro Plan' : 'Your Pro Plan'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {userPlan === 'free'
              ? 'Unlock premium features to enhance your experience.'
              : subscriptionStatus === 'canceling'
                ? 'Your subscription will remain active until the end of the billing period.'
                : 'You are currently enjoying all the benefits of our Pro Plan.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <p className="mb-4 text-sm text-red-500 dark:text-red-400">{errorMessage}</p>
          )}
          {renderSubscriptionStatus()}

          <Tabs defaultValue={userPlan === "free" ? "free" : "pro"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="free">Free Plan</TabsTrigger>
              <TabsTrigger value="pro">Pro Plan</TabsTrigger>
            </TabsList>
            <div className="md:flex md:space-x-4">
              {plans.map((plan) => (
                <TabsContent
                  key={plan.name.toLowerCase()}
                  value={plan.name.toLowerCase()}
                  className="mt-0 md:flex-1"
                >
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className={`text-lg font-bold mb-2 ${plan.name === 'Pro' ? 'text-purple-500' : ''}`}>
                        {plan.name} Plan
                      </h3>
                      {plan.name === 'Pro' && userPlan === 'pro' && (
                        <p className="mb-2 text-xs text-green-500">Your current plan</p>
                      )}
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </Tabs>

          {userPlan === 'free' && (
            <div className="flex items-center justify-center mt-6 space-x-2">
              <Label htmlFor="plan-toggle" className="text-sm font-medium">Monthly</Label>
              <Switch
                id="plan-toggle"
                checked={selectedPlanType === 'yearly'}
                onCheckedChange={(checked) => setSelectedPlanType(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="plan-toggle" className="text-sm font-medium">Yearly (Save 20%)</Label>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            {userPlan === 'free' ? 'Maybe later' : 'Close'}
          </Button>
          {renderActionButton()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}