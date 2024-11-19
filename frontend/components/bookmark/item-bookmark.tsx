import React from 'react'
import { Edit2, Trash2, MoreHorizontal, Globe, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { Bookmark } from '@/types/store'
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

interface BookmarkItemProps {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkItem({ bookmark, onEdit, onDelete }: BookmarkItemProps) {
  const { tags } = useBookmarkStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  return (
    <>
      <div className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
        <div className="flex items-start space-x-4">
          <div className="flex-grow space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <a
                href={bookmark.url}
                className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {bookmark.title}
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.url}</p>
            {bookmark.notes && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.notes}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId)
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                  className="ml-2"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 dark:text-red-400">
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