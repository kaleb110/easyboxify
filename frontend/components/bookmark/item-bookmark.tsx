import React, { useRef, useState } from 'react'
import { useDrag, useDrop} from 'react-dnd'
import { Edit2, Trash2, GripVertical, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, useBookmarkStore } from '@/store/bookmarkStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DragItem {
  id: string
  index: number
  type: string
}

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Define the types returned by `collect`
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'bookmark',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId() ?? null, // Explicitly setting it to null if undefined
    }),
    hover(item, monitor) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveBookmark(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, dragPreview] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'bookmark',
    item: () => ({ id: bookmark.id, index, type: 'bookmark' }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div
        ref={(instance) => {
          dragPreview(instance)
        }}
        style={{ opacity }}
        className="group mb-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800"
      >
        <div className="p-4 flex items-start space-x-4">
          <div ref={ref} data-handler-id={handlerId} className="cursor-move">
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-grow space-y-2">
            <a
              href={bookmark.url}
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {bookmark.title}
            </a>
            {bookmark.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.notes}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId)
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {tag.name}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bookmark {bookmark.title}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onDelete(bookmark.id)
              setIsDeleteDialogOpen(false)
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
