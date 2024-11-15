import React from 'react'
import { BookmarkItem } from './item-bookmark'
import { Bookmark } from '@/types/store'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onEditBookmark: (bookmark: Bookmark) => void
  onDeleteBookmark: (id: string) => void
  moveBookmark: (dragIndex: number, hoverIndex: number) => void
}

export function BookmarkList({ bookmarks, onEditBookmark, onDeleteBookmark, moveBookmark }: BookmarkListProps) {
  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark, index) => (
        <BookmarkItem
          key={bookmark.id}
          index={index}
          bookmark={bookmark}
          onEdit={onEditBookmark}
          onDelete={onDeleteBookmark}
          moveBookmark={moveBookmark}
        />
      ))}
    </div>
  )
}