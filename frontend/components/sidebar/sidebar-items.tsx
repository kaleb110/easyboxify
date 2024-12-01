'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'
import { FolderSection } from './folder-section'
import { TagSection } from './tag-section'
import { useBookmarkStore } from '@/store/bookmarkStore'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface SidebarItemsProps {
  onItemClick: () => void
}

export function SidebarItems({ onItemClick }: SidebarItemsProps) {
  const { setSelectedContent, selectedContent } = useBookmarkStore()

  const handleItemClick = (content: string) => {
    setSelectedContent(content)
    onItemClick()
  }

  return (
    <div className="flex flex-col h-full">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleItemClick('All Bookmarks')}
                className={`${selectedContent === 'All Bookmarks' ? 'bg-accent' : ''}`}
              >
                <div className="flex items-center pl-4">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500 font-body" />
                  <span>All Bookmarks</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <FolderSection onItemClick={onItemClick} />
      <TagSection onItemClick={onItemClick} />
    </div>
  )
}