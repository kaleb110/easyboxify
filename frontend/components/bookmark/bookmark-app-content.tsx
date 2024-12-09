'use client'

import React, { useState, useRef } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { AddBookmarkModal } from './add-bookmark-modal'
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
    <div className="fixed inset-0 flex w-full" style={{ touchAction: 'pan-y' }}>
      {/* sidebar component */}
      <SidebarComponent toggleSidebar={toggleSidebar} open={open} setOpen={setOpen} />

      <main className="flex flex-col flex-1">
        <header className="flex items-center justify-between py-1 pl-4 pr-2 border-b border-border">
          {isMobile && (
            <button onClick={toggleSidebar} className="mr-2">
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center justify-between w-full">
            {/* search component */}
            <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

        </header>
        <div className="flex-1 p-4 overflow-auto">
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