'use client'

import React, { useEffect, useState } from 'react'
import { Bookmark, X } from 'lucide-react'
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
      setSelectedTags(editingBookmark.tags.map((tag) => tag.id.toString()))
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
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const bookmarkData = {
      title,
      url,
      folderId: folderId || null,
      tags: selectedTags
        .filter(tagId => tagId !== undefined && tagId !== null && tagId !== ""), // Remove invalid values
      description
    }

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
    }
  }

  // Get the list of available tags that aren't already selected
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id.toString()))

  return (
    <Dialog open={isAddBookmarkModalOpen} onOpenChange={setIsAddBookmarkModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-sm text-red-500 mt-1">
                  {errors.title}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? "url-error" : undefined}
              />
              {errors.url && (
                <p id="url-error" className="text-sm text-red-500 mt-1">
                  {errors.url}
                </p>
              )}
            </div>
            {(!selectedContent || selectedContent === 'All Bookmarks') && (
              <div>
                <Label htmlFor="folder">Folder</Label>
                <Select value={folderId || ''} onValueChange={(value) => setFolderId(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id.toString()}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Select
                value={availableTags.length > 0 ? "" : "no-tags"}
                onValueChange={(value) => {
                  if (value !== "no-tags") {
                    setSelectedTags(prev => [...prev, value]) // Store only ID
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
                <SelectContent>
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
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id.toString() === tagId);
                  return tag ? (
                    <Button
                      key={tag.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedTags(prev => prev.filter(id => id !== tagId))}
                    >
                      {tag.name} <X className="ml-2 h-4 w-4" />
                    </Button>
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        </ScrollArea>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={() => setIsAddBookmarkModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>{editingBookmark ? 'Update' : 'Add'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
