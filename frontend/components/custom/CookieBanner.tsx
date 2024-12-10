"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already acknowledged the cookie notice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'false')
    setShowBanner(false)
  }

  return (
    <div
      className={`fixed bottom-4 left-4 max-w-sm bg-background border border-border rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${showBanner ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
    >
      <div className="p-4">
        <div className="space-y-3">
          <div className="text-sm text-foreground">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectCookies}
            >
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={acceptCookies}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner