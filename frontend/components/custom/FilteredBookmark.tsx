"use client"

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { BookmarkItem } from '../bookmark/item-bookmark'
import { MoreHorizontal, Edit, Trash2, ArrowDownAZ, ArrowUpZA, Calendar, LayoutGrid, List } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'

interface FilterProps {
  setItemToDelete: (item: { type: 'folder' | 'tag'; id: string; name: string } | null) => void;
}

type SortValue = "nameAZ" | "nameZA" | "date"
type LayoutValue = "card" | "list"

export default function FilteredBookmark({ setItemToDelete }: FilterProps) {
  const {
    selectedContent,
    bookmarks,
    searchTerm,
    folders,
    tags,
    setIsAddBookmarkModalOpen,
    setEditingBookmark,
    deleteBookmark,
    setEditingName,
    setIsDeleteDialogOpen,
    setIsRenameDialogOpen,
    getSortPreference,
    setSortPreference,
    getLayoutPreference,
    setLayoutPreference
  } = useBookmarkStore()

  const [sortBy, setSortBy] = useState<SortValue>('nameAZ')
  const [layout, setLayout] = useState<LayoutValue>('card')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true)
        const sortPreference = await getSortPreference()
        setSortBy(sortPreference as SortValue)
        const layoutPreference = await getLayoutPreference()
        setLayout(layoutPreference as LayoutValue)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load preferences:', error)
        setSortBy('nameAZ')
        setLayout('card')
        setIsLoading(false)
      }
    }
    loadPreferences()
  }, [getSortPreference, getLayoutPreference])

  const handleSortChange = useCallback(async (value: SortValue) => {
    setSortBy(value)
    try {
      await setSortPreference(value)
    } catch (error) {
      console.error('Failed to set sort preference:', error)
    }
  }, [setSortPreference])

  const handleLayoutChange = useCallback(async (value: LayoutValue) => {
    setLayout(value)
    try {
      await setLayoutPreference(value)
    } catch (error) {
      console.error('Failed to set layout preference:', error)
    }
  }, [setLayoutPreference])

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks
    if (selectedContent !== 'All Bookmarks') {
      const folder = folders.find((f) => f.name === selectedContent)
      if (folder) {
        filtered = bookmarks.filter((bookmark) => bookmark.folderId === folder.id)
      } else {
        const tag = tags.find((t) => t.name === selectedContent)
        if (tag) {
          filtered = bookmarks.filter((bookmark) =>
            bookmark.tags.some((bookmarkTag) => bookmarkTag?.id === tag?.id)
          )
        }
      }
    }

    filtered = filtered.filter((bookmark) =>
      bookmark?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (sortBy) {
      case 'nameAZ':
        return filtered.sort((a, b) => a.title.localeCompare(b.title))
      case 'nameZA':
        return filtered.sort((a, b) => b.title.localeCompare(a.title))
      case 'date':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return filtered
    }
  }, [selectedContent, bookmarks, folders, tags, searchTerm, sortBy])

  const startRenaming = () => {
    setEditingName(selectedContent)
    setIsRenameDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedContent !== 'All Bookmarks') {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        setItemToDelete({ type: 'folder', id: folder.id, name: folder.name })
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          setItemToDelete({ type: 'tag', id: tag.id.toString(), name: tag.name })
        }
      }
      setIsDeleteDialogOpen(true)
    }
  }

  const SortDropDown = () => (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Edit className="w-4 h-4 mr-2" />
        <span>Sort</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={sortBy} onValueChange={(value: string) => handleSortChange(value as SortValue)}>
          <DropdownMenuRadioItem value="nameAZ">
            <ArrowDownAZ className="w-4 h-4 mr-2" />
            Name (A-Z)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nameZA">
            <ArrowUpZA className="w-4 h-4 mr-2" />
            Name (Z-A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">
            <Calendar className="w-4 h-4 mr-2" />
            Date
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )

  const LayoutDropDown = () => (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {layout === 'card' ? <LayoutGrid className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
        <span>View</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={layout} onValueChange={(value: string) => handleLayoutChange(value as LayoutValue)}>
          <DropdownMenuRadioItem value="card">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Card
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="list">
            <List className="w-4 h-4 mr-2" />
            List
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h1 className="text-2xl font-bold truncate">{selectedContent}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {selectedContent !== 'All Bookmarks' ? (
              <>
                <DropdownMenuItem onSelect={startRenaming}>
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <SortDropDown />
                <LayoutDropDown />
              </>
            ) : (
              <>
                <SortDropDown />
                <LayoutDropDown />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className={
              layout === 'card'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max"
                : "flex flex-col space-y-4"
            }>
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className={layout === 'card' ? "w-full " : "w-full"}>
                  <BookmarkItem
                    bookmark={bookmark}
                    layout={layout}
                    onEdit={(bookmark) => {
                      setIsAddBookmarkModalOpen(true)
                      setEditingBookmark(bookmark)
                    }}
                    onDelete={deleteBookmark}
                  />
                </div>
              ))}
            </div>
          )}
          {!isLoading && filteredBookmarks.length === 0 && (
            <p className="mt-8 text-center text-gray-500">No bookmarks found.</p>
          )}
        </div>
      </div>
    </div>
  )
}