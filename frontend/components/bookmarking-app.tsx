'use client'

import * as React from 'react'
import { Bookmark, FolderClosed, Hash, Menu, Search, Settings, Plus } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { SidebarItems } from './sidebar-items'
import { AddBookmarkModal, BookmarkType } from './add-bookmark-modal'
import { BookmarkList } from './bookmark-list'

export function BookmarkingAppComponent() {
  const [selectedContent, setSelectedContent] = React.useState('All Bookmarks')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [folders, setFolders] = React.useState([
    { name: 'Work', content: 'Work content goes here' },
    { name: 'Personal', content: 'Personal content goes here' },
    { name: 'Learning', content: 'Learning content goes here' },
  ])
  const [tags, setTags] = React.useState(['Important', 'Read Later', 'Favorite'])
  const [bookmarks, setBookmarks] = React.useState<BookmarkType[]>([])
  const [editingBookmark, setEditingBookmark] = React.useState<BookmarkType | null>(null)
  const [isAddBookmarkModalOpen, setIsAddBookmarkModalOpen] = React.useState(false)

  const handleAddBookmark = (newBookmark: BookmarkType) => {
    setBookmarks(prevBookmarks => [...prevBookmarks, newBookmark])
    setIsAddBookmarkModalOpen(false)
  }

  const handleEditBookmark = (editedBookmark: BookmarkType) => {
    setBookmarks(prevBookmarks =>
      prevBookmarks.map(bookmark =>
        bookmark.id === editedBookmark.id ? editedBookmark : bookmark
      )
    )
    setEditingBookmark(null)
    setIsAddBookmarkModalOpen(false)
  }

  const handleOpenEditModal = (bookmark: BookmarkType) => {
    setEditingBookmark(bookmark)
    setIsAddBookmarkModalOpen(true)
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id))
  }

  const moveBookmark = (dragIndex: number, hoverIndex: number) => {
    const dragBookmark = bookmarks[dragIndex]
    setBookmarks(prevBookmarks => {
      const newBookmarks = [...prevBookmarks]
      newBookmarks.splice(dragIndex, 1)
      newBookmarks.splice(hoverIndex, 0, dragBookmark)
      return newBookmarks
    })
  }

  const getIconForContent = (content: string) => {
    if (content === 'All Bookmarks') return Bookmark
    if (content.startsWith('Tag:')) return Hash
    return FolderClosed
  }

  const SearchBar = () => {
    return (
      <div className="bg-background border-b border-border p-4 flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search bookmarks..."
            className="pl-8 pr-4 py-2 w-full"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {/* <Button variant="outline" size="icon" className="md:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button> */}
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden md:flex-row w-full">
          {/* Mobile header */}
          <header className="bg-background p-4 flex items-center justify-between md:hidden border-b border-border">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarHeader className="p-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="icon" onClick={() => setIsAddBookmarkModalOpen(true)}>
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarItems
                    folders={folders}
                    tags={tags}
                    selectedContent={selectedContent}
                    setSelectedContent={(content) => {
                      setSelectedContent(content)
                      setIsMobileMenuOpen(false)
                    }}
                    setFolders={setFolders}
                    setTags={setTags}
                  />
                </SidebarContent>
              </SheetContent>
            </Sheet>
            <SearchBar />

          </header>

          {/* Sidebar for larger screens */}
          <Sidebar className="hidden md:block w-64 border-r border-border flex-shrink-0">
            <SidebarHeader className="p-4 border-b border-border">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarItems
                folders={folders}
                tags={tags}
                selectedContent={selectedContent}
                setSelectedContent={setSelectedContent}
                setFolders={setFolders}
                setTags={setTags}
              />
            </SidebarContent>
          </Sidebar>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto w-full flex flex-col">
            <div className='max-md:hidden'>
              <SearchBar />
            </div>

            {/* Title of selected content */}
            <div className="bg-background border-b border-border p-4 flex justify-between items-center">
              <div className='flex'>{React.createElement(getIconForContent(selectedContent), { className: "h-6 w-6 mr-2" })}
                <h2 className="text-xl font-semibold">{selectedContent}</h2></div>

              <Button variant="ghost" size="icon" onClick={() => setIsAddBookmarkModalOpen(true)}>
                <Plus className="h-5 w-5" />
                <span className="sr-only">Add bookmark</span>
              </Button>
            </div>

            {/* Bookmarks list */}
            <div className="flex-1 p-4 overflow-y-auto">
              <BookmarkList
                bookmarks={bookmarks}
                onEditBookmark={handleOpenEditModal}
                onDeleteBookmark={handleDeleteBookmark}
                moveBookmark={moveBookmark}
              />
            </div>
          </main>

          <AddBookmarkModal
            folders={folders}
            onAddBookmark={handleAddBookmark}
            editingBookmark={editingBookmark}
            onEditBookmark={handleEditBookmark}
            isOpen={isAddBookmarkModalOpen}
            setIsOpen={setIsAddBookmarkModalOpen}
          />
        </div>
      </SidebarProvider>
    </DndProvider>
  )
}