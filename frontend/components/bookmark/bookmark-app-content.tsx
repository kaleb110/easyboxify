'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { AddBookmarkModal } from './add-bookmark-modal'
import { SidebarItems } from '../sidebar/sidebar-items'
import { BookmarkItem } from './item-bookmark'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreHorizontal, Edit, Trash2, Plus, Menu,  X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import SearchComponent from '../custom/SearchComponent'

export const BookmarkingAppContent = () => {
  // Log to check component rerenders
  console.log('BookmarkingAppContent rerendered');

  const {
    bookmarks,
    selectedContent,
    setIsAddBookmarkModalOpen,
    setEditingBookmark,
    deleteBookmark,
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
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'tag', id: string, name: string } | null>(null)
  const renameFormRef = useRef<HTMLFormElement>(null)

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

  const filteredBookmarks = useMemo(() => {
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
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
      // ||
      // bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [selectedContent, bookmarks, folders, tags, searchTerm])

  const startRenaming = () => {
    setEditingName(selectedContent)
    setIsRenameDialogOpen(true)
  }

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingName.trim() && editingName.trim() !== selectedContent) {
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
      setIsRenameDialogOpen(false)
    } else {
      if (renameFormRef.current) {
        const input = renameFormRef.current.querySelector('input')
        if (input) {
          input.reportValidity()
        }
      }
    }
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
    setSearchTerm('') // Reset search term when changing tabs
  }

  const toggleSidebar = () => {
    setOpen(!open)
  }
  
  return (
    <div className="flex h-screen overflow-hidden w-full" style={{ touchAction: 'pan-y' }}>
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
          <div className="flex justify-between items-center w-full">
            <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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

        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{selectedContent}</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={(bookmark) => {
                  setIsAddBookmarkModalOpen(true)
                  setEditingBookmark(bookmark)
                }}
                onDelete={deleteBookmark}
              />
            ))}
          </div>
          {filteredBookmarks.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No bookmarks found.</p>
          )}
        </div>
      </main>
      <AddBookmarkModal />
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedContent}</DialogTitle>
          </DialogHeader>
          <form ref={renameFormRef} onSubmit={handleRename}>
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter new name"
              className="mt-4"
              required
              minLength={1}
              pattern={`^(?!${selectedContent}$).+`}
              title="New name must be different from the current name"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>Rename</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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