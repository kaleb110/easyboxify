import React from 'react'
import { BookmarkItem } from './item-bookmark'
import { Bookmark } from '@/types/store'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onEditBookmark: (bookmark: Bookmark) => void
  onDeleteBookmark: (id: string) => void
}

export function BookmarkList({ bookmarks, onEditBookmark, onDeleteBookmark }: BookmarkListProps) {
  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onEdit={onEditBookmark}
          onDelete={onDeleteBookmark}
        />
      ))}
    </div>
  )
}