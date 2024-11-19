'use client'

import React from 'react'
import { BookmarkingAppContent } from './bookmark-app-content'
import { SidebarProvider } from "@/components/ui/sidebar"

const BookmarkingAppComponent = () => {
  return (
    <SidebarProvider>
      <BookmarkingAppContent />
    </SidebarProvider>
  )
}

export default BookmarkingAppComponent