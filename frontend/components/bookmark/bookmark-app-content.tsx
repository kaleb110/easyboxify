'use client'

import React, { useState, useEffect } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { AddBookmarkModal } from './add-bookmark-modal'
import { SidebarItems } from '../sidebar/sidebar-items'
import { BookmarkItem } from './item-bookmark'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreHorizontal, Edit, Trash2, Plus, Menu, Search, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ModeToggle } from '../theme/toggle'
import UserAvatar from '../custom/UserAvatar'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"

export const BookmarkingAppContent = () => {
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

  const { open, setOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingName, setEditingName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'tag', id: string, name: string } | null>(null)

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
  }, [setOpen])

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
    if (selectedContent !== 'All Bookmarks') {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        setItemToDelete({ type: 'folder', id: folder.id, name: folder.name })
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          setItemToDelete({ type: 'tag', id: tag.id, name: tag.name })
        }
      }
      setIsDeleteDialogOpen(true)
    }
  }

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setOpen(false)
    }
  }

  const toggleSidebar = () => {
    setOpen(!open)
  }

  const ContentNavBar = () => (
    <div className="flex justify-between items-center w-full">
      <div className="relative flex-1 max-w-sm">
        <Input
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <div className='flex gap-2 ml-4'>
        <Button
          onClick={() => {
            setEditingBookmark(null)
            setIsAddBookmarkModalOpen(true)
          }}
          size="icon"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <ModeToggle />
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <Sidebar className="border-r border-border bg-background" open={open} onOpenChange={setOpen}>
        <SidebarHeader className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Bookmarks</h2>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-transparent">
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="flex-grow overflow-y-auto h-[calc(100vh-8rem)]">
            <div className="p-4">
              <SidebarItems onItemClick={handleSidebarItemClick} />
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          <UserAvatar />
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-border">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <ContentNavBar />
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            {isRenaming ? (
              <form onSubmit={(e) => { e.preventDefault(); handleRename(); }} className="flex-1 mr-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleRename}
                  className="max-w-sm"
                  autoFocus
                />
              </form>
            ) : (
              <h1 className="text-2xl font-bold">{selectedContent}</h1>
            )}
            {selectedContent !== 'All Bookmarks' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={startRenaming}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <AddBookmarkModal />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {itemToDelete ? ` "${itemToDelete.name}" ${itemToDelete.type}` : ''} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (itemToDelete) {
                if (itemToDelete.type === 'folder') {
                  deleteFolder(itemToDelete.id)
                } else if (itemToDelete.type === 'tag') {
                  deleteTag(itemToDelete.id)
                }
                setSelectedContent('All Bookmarks')
              }
              setIsDeleteDialogOpen(false)
              setItemToDelete(null)
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}