import React from 'react'
import { BookmarkType } from './add-bookmark-modal'
import { BookmarkItem } from './bookmark-item'

interface BookmarkListProps {
  bookmarks: BookmarkType[]
  onEditBookmark: (bookmark: BookmarkType) => void
  onDeleteBookmark: (id: string) => void
  moveBookmark: (dragIndex: number, hoverIndex: number) => void
}

export function BookmarkList({ bookmarks, onEditBookmark, onDeleteBookmark, moveBookmark }: BookmarkListProps) {
  return (
    <ul className="space-y-4">
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
    </ul>
  )
}