'use client'

import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { SidebarItems } from './sidebar-items'
import { AddBookmarkModal } from './add-bookmark-modal'
import { BookmarkItem } from './bookmark-item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

export function BookmarkingAppComponent() {
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
  const { toast } = useToast()

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

  const handleRename = () => {
    if (editingName.trim()) {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        renameFolder(folder.id, editingName.trim())
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          renameTag(tag.id, editingName.trim())
        }
      }
      setIsRenaming(false)
    } else {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      })
    }
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-100 p-4">
          <SidebarItems />
        </aside>
        <main className="flex-1 p-4">
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-between items-center mb-4">
            {isRenaming ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
              />
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
                  <DropdownMenuItem onSelect={() => {
                    setEditingName(selectedContent)
                    setIsRenaming(true)
                  }}>
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
          <Button
            onClick={() => {
              setEditingBookmark(null)
              setIsAddBookmarkModalOpen(true)
            }}
            className="mb-4"
          >
            Add Bookmark
          </Button>
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
        </main>
      </div>
      <AddBookmarkModal />
    </DndProvider>
  )
}