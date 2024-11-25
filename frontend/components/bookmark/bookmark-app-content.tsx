'use client'

import React, { useState, useRef } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { AddBookmarkModal } from './add-bookmark-modal'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  useSidebar
} from "@/components/ui/sidebar"
import SearchComponent from '../custom/SearchComponent'
import RenameComponent from '../custom/RenameComponent'
import SidebarComponent from '../custom/SidebarComponent'
import FilteredBookmark from '../custom/FilteredBookmark'

export const BookmarkingAppContent = () => {
  const {
    isMobile,
    searchTerm,
    setSearchTerm
  } = useBookmarkStore()


  const { open, setOpen } = useSidebar()
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'tag', id: string, name: string } | null>(null)
  const renameFormRef = useRef<HTMLFormElement>(null)
  const toggleSidebar = () => {
    setOpen(!open)
  }

  return (
    <div className="flex h-screen overflow-hidden w-full" style={{ touchAction: 'pan-y' }}>
      {/* sidebar component */}
      <SidebarComponent toggleSidebar={toggleSidebar} open={open} setOpen={setOpen} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-border">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <div className="flex justify-between items-center w-full">
            {/* search component */}
            <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

        </header>
        <div className="flex-1 overflow-auto p-4">
          {/* Filtered Bookmarks */}
          <FilteredBookmark setItemToDelete={setItemToDelete} />
        </div>
      </main>
      {/* add bookmark modal */}
      <AddBookmarkModal />
      {/* rename dialog */}
      <RenameComponent
        itemToDelete={itemToDelete}
        renameFormRef={renameFormRef}
        setItemToDelete={setItemToDelete}
      />
    </div>
  )
}