'use client'

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BookmarkingAppContent } from './bookmark-app-content'
import { SidebarProvider } from "@/components/ui/sidebar"

const BookmarkingAppComponent = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <BookmarkingAppContent />
      </SidebarProvider>
    </DndProvider>
  )
}

export default BookmarkingAppComponent