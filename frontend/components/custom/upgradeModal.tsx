'use client'

import React, { useState } from 'react'
import { Sparkles, CheckCircle2, Zap } from 'lucide-react'
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

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, errorMessage } = useUIStore()
  const {userPlan} = useBookmarkStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlanType, setSelectedPlanType] = useState('monthly') // 'monthly' or 'yearly'

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    // Implement subscription cancellation logic here
    alert("Subscription cancellation not implemented yet.")
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
        'Early access to new features',
      ],
    },
  ]

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] max-h-[90vh] md:max-h-none md:h-auto overflow-y-auto md:overflow-y-visible">
        <DialogHeader className="md:text-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 md:justify-center">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            {userPlan === 'free' ? 'Upgrade to Pro Plan' : 'Your Pro Plan'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {userPlan === 'free'
              ? 'Unlock premium features to enhance your experience.'
              : 'You are currently enjoying all the benefits of our Pro Plan.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {errorMessage && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">{errorMessage}</p>
          )}
          <Tabs defaultValue={userPlan === "free" ? "free" : "pro"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="free">Free Plan</TabsTrigger>
              <TabsTrigger value="pro">Pro Plan</TabsTrigger>
            </TabsList>
            <div className="md:flex md:space-x-4">
              {plans.map((plan) => (
                <TabsContent key={plan.name.toLowerCase()} value={plan.name.toLowerCase()} className="mt-0 md:flex-1">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className={`text-lg font-bold mb-2 ${plan.name === 'Pro' ? 'text-purple-500' : ''}`}>
                        {plan.name} Plan
                      </h3>
                      {plan.name === 'Pro' && userPlan === 'pro' && (
                        <p className="text-xs text-green-500 mb-2">Your current plan</p>
                      )}
                      <ul className="text-sm space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
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
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Label htmlFor="plan-toggle" className="text-sm font-medium">Monthly</Label>
            <Switch
              id="plan-toggle"
              checked={selectedPlanType === 'yearly'}
              onCheckedChange={(checked) => setSelectedPlanType(checked ? 'yearly' : 'monthly')}
            />
            <Label htmlFor="plan-toggle" className="text-sm font-medium">Yearly (Save 20%)</Label>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-end">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            {userPlan === 'free' ? 'Maybe later' : 'Close'}
          </Button>
          {userPlan === 'free' ? (
            <Button onClick={handleCheckout} className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : `Upgrade to Pro (${selectedPlanType})`}
            </Button>
          ) : (
            <Button onClick={handleCancelSubscription} variant="destructive" className="w-full sm:w-auto">
              <Zap className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}