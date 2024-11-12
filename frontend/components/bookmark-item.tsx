import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, useBookmarkStore } from '@/store/bookmarkStore'

interface BookmarkItemProps {
  bookmark: Bookmark
  index: number
  moveBookmark: (dragIndex: number, hoverIndex: number) => void
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkItem({ bookmark, index, moveBookmark, onEdit, onDelete }: BookmarkItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { tags } = useBookmarkStore()

  const [{ handlerId }, drop] = useDrop({
    accept: 'bookmark',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveBookmark(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'bookmark',
    item: () => {
      return { id: bookmark.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))

  return (
    <div ref={dragPreview} style={{ opacity }} className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow-sm">
      <div ref={ref} className="cursor-move">
        <GripVertical className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-grow space-y-2">
        <h3 className="text-lg font-semibold">{bookmark.title}</h3>
        <a href={bookmark.url} className="text-sm text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
          {bookmark.url}
        </a>
        {bookmark.notes && (
          <p className="text-sm text-muted-foreground">{bookmark.notes}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((tagId) => {
            const tag = tags.find(t => t.id === tagId)
            return tag ? (
              <Badge key={tagId} variant="secondary">
                {tag.name}
              </Badge>
            ) : null
          })}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(bookmark)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(bookmark.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}