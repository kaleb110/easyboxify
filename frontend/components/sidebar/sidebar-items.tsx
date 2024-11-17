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
  const { setSelectedContent } = useBookmarkStore()

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
              >
                <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                All Bookmarks
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