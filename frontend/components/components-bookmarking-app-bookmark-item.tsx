'use client'

import React from 'react'
import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { BookmarkType } from './add-bookmark-modal'
import { Button } from '@/components/ui/button'

interface BookmarkItemProps {
  bookmark: BookmarkType
  onEdit: (bookmark: BookmarkType) => void
  onDelete: (id: string) => void
}

export function BookmarkItem({ bookmark, onEdit, onDelete }: BookmarkItemProps) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex-shrink-0 mt-1">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{bookmark.title}</h3>
        <a href={bookmark.url} className="text-sm text-muted-foreground hover:underline" target="_blank" rel="noopener noreferrer">
          {bookmark.url}
        </a>
        <p className="text-sm mt-2">
          {bookmark.notes}
          {bookmark.notes && bookmark.tags.length > 0 && ' | '}
          {bookmark.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </p>
      </div>
      <div className="flex-shrink-0 space-y-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(bookmark)}>
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(bookmark.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}