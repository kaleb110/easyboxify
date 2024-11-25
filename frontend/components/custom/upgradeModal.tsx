'use client'

import React from 'react'
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, errorMessage } = useUIStore()

  const handleClose = () => {
    setShowUpgradeModal(false)
  }

  const handleUpgrade = () => {
    window.location.href = '/upgrade'
  }

  const plans = [
    {
      name: 'Free',
      features: [
        { name: 'Up to 3 folders', included: true },
        { name: 'Up to 3 tags', included: true },
        { name: 'Up to 100 bookmarks', included: true },
        { name: 'Unlimited folders', included: false },
        { name: 'Unlimited tags', included: false },
        { name: 'Unlimited bookmarks', included: false },
        { name: 'Upcoming features', included: false },
      ],
    },
    {
      name: 'Pro',
      features: [
        { name: 'Up to 3 folders', included: true },
        { name: 'Up to 3 tags', included: true },
        { name: 'Up to 100 bookmarks', included: true },
        { name: 'Unlimited folders', included: true },
        { name: 'Unlimited tags', included: true },
        { name: 'Unlimited bookmarks', included: true },
        { name: 'Upcoming features', included: true },
      ],
    },
  ]

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Upgrade to Pro Plan
          </DialogTitle>
          <DialogDescription>
            Compare our plans and unlock premium features to enhance your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {errorMessage && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errorMessage}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle className={`text-xl font-bold ${plan.name === 'Pro' ? 'text-purple-500' : ''}`}>
                    {plan.name} Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className={feature.included ? '' : 'text-gray-400'}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Maybe later
          </Button>
          <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}