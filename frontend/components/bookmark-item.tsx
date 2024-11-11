import React, { useRef } from 'react'
import { Edit2, Trash2, GripVertical, MoreVertical } from 'lucide-react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { BookmarkType } from './add-bookmark-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BookmarkItemProps {
  bookmark: BookmarkType
  index: number
  onEdit: (bookmark: BookmarkType) => void
  onDelete: (id: string) => void
  moveBookmark: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number;
  // Add other properties as needed
}

export function BookmarkItem({ bookmark, index, onEdit, onDelete, moveBookmark }: BookmarkItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<
    DragItem, // Expected item type for the drop target
    void,         // Return type of drop
    { handlerId: string | symbol | null } // Collected properties
  >({
    accept: 'bookmark',
    collect(monitor: DropTargetMonitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
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

  const [{ isDragging }, drag] = useDrag({
    type: 'bookmark',
    item: () => {
      return { id: bookmark.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex-shrink-0 mt-1 cursor-move hidden md:block">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3>
        <a href={bookmark.url} className="text-sm text-muted-foreground hover:underline block truncate" target="_blank" rel="noopener noreferrer">
          {bookmark.url}
        </a>
        {bookmark.notes && (
          <p className="text-sm mt-2 bg-secondary/20 p-2 rounded-md text-secondary-foreground line-clamp-2">
            {bookmark.notes}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {bookmark.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-green-100 text-primary rounded-full px-2 py-1 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 space-y-2 hidden md:block">
        <Button variant="ghost" size="icon" onClick={() => onEdit(bookmark)}>
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(bookmark.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <div className="flex-shrink-0 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(bookmark)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(bookmark.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}