import React from 'react'
import { useMemo } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { BookmarkItem } from '../bookmark/item-bookmark'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'

interface FilterProps {
  setItemToDelete: (item: { type: 'folder' | 'tag'; id: string; name: string } | null) => void;
}

const FilteredBookmark: React.FC<FilterProps> = ({ setItemToDelete }) => {
  const { selectedContent, bookmarks, searchTerm, folders, tags, setIsAddBookmarkModalOpen,
    setEditingBookmark, deleteBookmark,
    setEditingName,
    setIsDeleteDialogOpen,
    setIsRenameDialogOpen,
  } = useBookmarkStore()
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

  return (
    <>
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
    </>
  )
}

export default FilteredBookmark