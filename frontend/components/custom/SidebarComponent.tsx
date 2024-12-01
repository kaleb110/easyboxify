/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client"
import React from 'react'
import { SidebarItems } from '../sidebar/sidebar-items'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useEffect } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { X } from 'lucide-react'

interface SidebarProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  toggleSidebar: () => void
}
const SidebarComponent: React.FC<SidebarProps> = ({open, setOpen, toggleSidebar}) => {
  const { setIsMobile, isMobile, setSearchTerm } = useBookmarkStore()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setOpen, setIsMobile])

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setOpen(false)
    }
    setSearchTerm('') // Reset search term when changing tabs
  }

  return (
    <Sidebar className="border-r border-border bg-background dark:bg-sidebar-background" open={open} onOpenChange={setOpen}>
      <SidebarHeader className="px-6 sm:px-4 py-4">
        <div className="flex justify-between items-center">
          {isMobile && (
            <button onClick={toggleSidebar} className="hover:bg-transparent">
              <X className="h-6 w-6" />
            </button>
          )}
          <h2 className="text-lg font-semibold font-heading md:pl-5">Bookmarks</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-grow overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="pr-4 py-2">
            <SidebarItems onItemClick={handleSidebarItemClick} />
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarComponent