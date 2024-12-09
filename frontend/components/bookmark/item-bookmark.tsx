"use client"
import React, { useState } from 'react'
import { Edit2, Trash2, MoreHorizontal, Globe, FileText, Eye } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookmarkItemProps {
  bookmark: Bookmark
  layout?: 'card' | 'list'
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkItem({ bookmark, layout, onEdit, onDelete }: BookmarkItemProps) {
  const { tags } = useBookmarkStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  

  const renderCardLayout = () => (
    <div className="p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm group dark:border-gray-700 hover:shadow-md dark:bg-gray-800">
      <div className="flex items-start space-x-4">
        <div className="flex-grow space-y-2">
          {/* title */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <a
              href={bookmark.url}
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline bookmark-title"
              target="_blank"
              rel="noopener noreferrer"
            >
              {bookmark.title}
            </a>
          </div>
          {/* url */}
          <p className="font-mono text-sm text-muted-foreground bookmark-url break-all overflow-hidden text-ellipsis max-w-[calc(100%-1rem)]">
            {bookmark.url}
          </p>
          {/* description */}
          {bookmark.description && (
            <div className="flex items-center space-x-2">
              <div><FileText className="w-4 h-4 text-gray-400" /></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.description.slice(0, 60)}</p>
            </div>
          )}
          {/* tags */}
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tagId) => {
              const tag = tags.find(t => t.id === tagId?.id)
              
              return tag ? (
                <Badge key={tag.id} variant="secondary" className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
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
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  const renderListLayout = () => (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <a
        href={bookmark.url}
        className="text-blue-600 dark:text-blue-400 hover:underline bookmark-title"
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookmark.title}
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(bookmark)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 dark:text-red-400">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <>
      {layout === 'card' ? renderCardLayout() : renderListLayout()}

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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{bookmark.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">URL</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {bookmark.url}
                </a>
              </p>
            </div>
            {bookmark.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{bookmark.description}</p>
              </div>
            )}
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId?.id)

                return tag ? (
                  <Badge key={tag.id} variant="secondary" className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
                    {tag.name}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BookmarkItem