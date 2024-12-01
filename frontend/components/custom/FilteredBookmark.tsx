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
const FilteredBookmark: React.FC<FilterProps> = ({ setItemToDelete }) => {
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

  const [sortBy, setSortBy] = useState<'nameAZ' | 'nameZA' | 'date'>('nameAZ')
  const [layout, setLayout] = useState<'card' | 'list'>('card')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const sortPreference = await getSortPreference();
        setSortBy(sortPreference as 'nameAZ' | 'nameZA' | 'date');
        const layoutPreference = await getLayoutPreference();
        setLayout(layoutPreference as 'card' | 'list');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load preferences:', error);
        setSortBy('nameAZ');
        setLayout('card');
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, [getSortPreference, getLayoutPreference]);

  const handleSortChange = useCallback(async (value: 'nameAZ' | 'nameZA' | 'date') => {
    setSortBy(value)
    try {
      await setSortPreference(value)
    } catch (error) {
      console.error('Failed to set sort preference:', error)
    }
  }, [setSortPreference])

  const handleLayoutChange = useCallback(async (value: 'card' | 'list') => {
    setLayout(value)
    try {
      await setLayoutPreference(value)
    } catch (error) {
      console.error('Failed to set layout preference:', error)
    }
  }, [setLayoutPreference])

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;
    if (selectedContent !== 'All Bookmarks') {
      const folder = folders.find((f) => f.name === selectedContent);
      if (folder) {
        filtered = bookmarks.filter((bookmark) => bookmark.folderId === folder.id);
      } else {
        const tag = tags.find((t) => t.name === selectedContent);
        if (tag) {
          // Use `some` to check if any tag in the bookmark matches the selected tag
          filtered = bookmarks.filter((bookmark) =>
            bookmark.tags.some((bookmarkTag) => bookmarkTag?.id === tag?.id)
          );
        }
      }
    }

    filtered = filtered.filter((bookmark) =>
      bookmark?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    switch (sortBy) {
      case 'nameAZ':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'nameZA':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      case 'date':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filtered;
    }
  }, [selectedContent, bookmarks, folders, tags, searchTerm, sortBy]);

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

  const SortDropDown = () => {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Edit className="mr-2 h-4 w-4" />
          <span>Sort</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={sortBy} onValueChange={(value: string) => handleSortChange(value as SortValue)}>
            <DropdownMenuRadioItem value="nameAZ">
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              Name (A-Z)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="nameZA">
              <ArrowUpZA className="mr-2 h-4 w-4" />
              Name (Z-A)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )
  }

  const LayoutDropDown = () => {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {layout === 'card' ? <LayoutGrid className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
          <span>View</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={layout} onValueChange={(value: string) => handleLayoutChange(value as LayoutValue)}>
            <DropdownMenuRadioItem value="card">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Card
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="list">
              <List className="mr-2 h-4 w-4" />
              List
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{selectedContent}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {selectedContent !== 'All Bookmarks' ? (
              <>
                <DropdownMenuItem onSelect={startRenaming}>
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
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
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-100 dark:bg-gray-800">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className={layout === 'card' ? "grid grid-cols-1 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              layout={layout}
              onEdit={(bookmark) => {
                setIsAddBookmarkModalOpen(true);
                setEditingBookmark(bookmark);
              }}
              onDelete={deleteBookmark}
            />
          ))}
        </div>
      )}
      {!isLoading && filteredBookmarks.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No bookmarks found.</p>
      )}
    </>
  )
}

export default FilteredBookmark

