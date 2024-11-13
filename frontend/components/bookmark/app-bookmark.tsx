'use client'

import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { AddBookmarkModal } from './add-bookmark-modal'
import { SidebarItems } from '../sidebar/sidebar-items'
import { BookmarkItem } from './item-bookmark'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Plus, Menu, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '../custom/UserAvatar'
import { ModeToggle } from '../theme/toggle'
export default function BookmarkingAppComponent() {
  const {
    bookmarks,
    selectedContent,
    setIsAddBookmarkModalOpen,
    setEditingBookmark,
    deleteBookmark,
    reorderBookmarks,
    folders,
    tags,
    renameFolder,
    renameTag,
    deleteFolder,
    deleteTag,
    setSelectedContent,
  } = useBookmarkStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [editingName, setEditingName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setIsSidebarOpen(!isMobileView)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredBookmarks = React.useMemo(() => {
    let filtered = bookmarks
    if (selectedContent !== 'All Bookmarks') {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        filtered = bookmarks.filter(bookmark => bookmark.folderId === folder.id)
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          filtered = bookmarks.filter(bookmark => bookmark.tags.includes(tag.id))
        }
      }
    }
    return filtered.filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [selectedContent, bookmarks, folders, tags, searchTerm])

  const moveBookmark = (dragIndex: number, hoverIndex: number) => {
    reorderBookmarks(dragIndex, hoverIndex)
  }

  const startRenaming = () => {
    setEditingName(selectedContent)
    setIsRenaming(true)
  }

  const handleRename = () => {
    if (editingName.trim() && editingName !== selectedContent) {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        renameFolder(folder.id, editingName.trim())
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          renameTag(tag.id, editingName.trim())
        }
      }
      setSelectedContent(editingName.trim())
    }
    setIsRenaming(false)
  }

  const handleDelete = () => {
    const folder = folders.find(f => f.name === selectedContent)
    if (folder) {
      deleteFolder(folder.id)
    } else {
      const tag = tags.find(t => t.name === selectedContent)
      if (tag) {
        deleteTag(tag.id)
      }
    }
    setSelectedContent('All Bookmarks')
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const ContentNavBar = () => {
    return <div className="flex justify-center items-center">
      <Input
        placeholder="Search bookmarks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm"
      />
      <div className='flex gap-2'><Button
        onClick={() => {
          setEditingBookmark(null)
          setIsAddBookmarkModalOpen(true)
        }}
        size="icon"
        className="ml-2"
      >
        <Plus className="h-4 w-4" />


      </Button>
        <ModeToggle />
      </div>
    </div>
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between gap-2 p-4  md:hidden bg-gray-100 dark:bg-gray-800">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-10 w-10" />
          </Button>
          <ContentNavBar />
        </header>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs  transition-transform duration-300 ease-in-out transform
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:relative md:translate-x-0 md:w-64
              flex flex-col h-full dark:bg-gray-800 bg-gray-100
            `}
          >
            {/* TODO:insert avatar icon */}
            <div className="flex justify-between items-center pl-4 pr-2 pt-4 md:hidden">
              <UserAvatar />
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-8 w-8" />
              </Button>

            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <SidebarItems onItemClick={closeSidebar} />
            </div>
          </aside>

          {/* Overlay */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4">
              <div className='max-sm:hidden'><ContentNavBar /></div>
              <div className="flex justify-between items-center mb-4">
                {isRenaming ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleRename(); }}>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => setIsRenaming(false)}
                      autoFocus
                      className="max-w-sm"
                    />
                  </form>
                ) : (
                  <h1 className="text-2xl font-bold">{selectedContent}</h1>
                )}
                {selectedContent !== 'All Bookmarks' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={startRenaming}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {filteredBookmarks.map((bookmark, index) => (
                  <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    index={index}
                    moveBookmark={moveBookmark}
                    onEdit={(bookmark) => {
                      setIsAddBookmarkModalOpen(true)
                      setEditingBookmark(bookmark)
                    }}
                    onDelete={deleteBookmark}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      <AddBookmarkModal />
    </DndProvider>
  )
}