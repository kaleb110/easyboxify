'use client'

import React, { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/types/store'
export function AddBookmarkModal() {
  const {
    isAddBookmarkModalOpen,
    setIsAddBookmarkModalOpen,
    fetchBookmark,
    addBookmark,
    editBookmark,
    editingBookmark,
    folders,
    tags,
    selectedContent,
  } = useBookmarkStore()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [folderId, setFolderId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  // Fetch bookmarks when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchBookmark()
    }

    fetchData()
  }, [])

  // Populate form fields when editingBookmark is available
  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title)
      setUrl(editingBookmark.url)
      setFolderId(editingBookmark.folderId?.toString() || null)
      setSelectedTags((editingBookmark.tags as unknown as Tag[]).map(tag => tag.id.toString()))
      setDescription(editingBookmark.description || '') // Ensure proper field is used
    } else {
      resetForm()
    }
  }, [editingBookmark, isAddBookmarkModalOpen, selectedContent])

  // Reset form fields to default
  const resetForm = () => {
    setTitle('')
    setUrl('')
    setDescription('')
    setSelectedTags([])
    setErrors({})

    const selectedFolder = folders.find(folder => folder.name === selectedContent)
    const selectedTag = tags.find(tag => tag.name === selectedContent)

    if (selectedFolder) {
      setFolderId(selectedFolder.id.toString())
    } else if (selectedTag) {
      setFolderId(null)
      setSelectedTags([selectedTag.id.toString()]) // Set ID directly
    } else {
      setFolderId(null)
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      // Prepend "http://" if the URL starts with "www."
      const formattedUrl = url.startsWith('www.') ? `http://${url}` : url
      new URL(formattedUrl)
      return true
    } catch {
      return false
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    const bookmarkData = {
      title,
      url,
      folderId: folderId || null,
      tags: selectedTags.map(id => ({ id: Number(id), name: '' })),
      description,
      createdAt: new Date().toISOString()
    };

    try {
      if (editingBookmark) {
        // Edit existing bookmark
        await editBookmark(editingBookmark.id, bookmarkData)
      } else {
        // Add a new bookmark
        await addBookmark(bookmarkData)
      }

      // Fetch bookmarks again after modification
      await fetchBookmark()

      // Close the modal after successful operation
      setIsAddBookmarkModalOpen(false)
    } catch (error) {
      console.error('Error handling bookmark submission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get the list of available tags that aren't already selected
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id.toString()))

  return (
    <Dialog open={isAddBookmarkModalOpen} onOpenChange={setIsAddBookmarkModalOpen}>
      <DialogContent className="sm:max-w-[425px] font-body">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-primary">
            {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium text-foreground">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="px-0 bg-transparent border-0 border-b rounded-none border-input focus-visible:ring-0 focus-visible:border-primary font-body"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-sm text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className="font-medium text-foreground">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="px-0 font-mono text-sm bg-transparent border-0 border-b rounded-none border-input focus-visible:ring-0 focus-visible:border-primary"
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? "url-error" : undefined}
              />
              {errors.url && (
                <p id="url-error" className="text-sm text-destructive">
                  {errors.url}
                </p>
              )}
            </div>

            {/* Folder Select */}
            {folders.length > 0 && (!selectedContent || selectedContent === 'All Bookmarks') && (
              <div className="space-y-2">
                <Label htmlFor="folder" className="font-medium text-foreground">
                  Folder
                </Label>
                <Select value={folderId || ''} onValueChange={(value) => setFolderId(value || null)}>
                  <SelectTrigger className="px-0 border-t-0 border-b-2 rounded-none border-x-0 focus:border-primary focus:ring-0 bg-background/50">
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent className="font-body">
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id.toString()}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tags Select */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="font-medium text-foreground">
                Tags
              </Label>
              <Select
                value={availableTags.length > 0 ? "" : "no-tags"}
                onValueChange={(value) => {
                  if (value !== "no-tags") {
                    setSelectedTags(prev => [...prev, value])
                  }
                }}
              >
                <SelectTrigger className="px-0 border-t-0 border-b-2 rounded-none border-x-0 focus:border-primary focus:ring-0 bg-background/50">
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
                <SelectContent className="font-body">
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tags">No tags available</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id.toString() === tagId);
                  return tag ? (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="px-2 py-1 text-sm bg-primary/10 text-primary font-body"
                    >
                      {tag.name}
                      <button
                        onClick={() => setSelectedTags(prev => prev.filter(id => id !== tagId))}
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="font-medium text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-input bg-transparent focus-visible:ring-0 focus-visible:border-primary rounded-md font-body min-h-[100px] resize-y"
              />
            </div>
          </form>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddBookmarkModalOpen(false)}
            className="font-body"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground font-body"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : editingBookmark ? 'Update' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
