import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
    addBookmark,
    editBookmark,
    editingBookmark,
    folders,
    tags,
    selectedContent,
  } = useBookmarkStore()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [folderId, setFolderId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title)
      setUrl(editingBookmark.url)
      setFolderId(editingBookmark.folderId || '')
      setSelectedTags(editingBookmark.tags)
      setNotes(editingBookmark.notes)
    } else {
      resetForm()
    }
  }, [editingBookmark, isAddBookmarkModalOpen])

  const resetForm = () => {
    setTitle('')
    setUrl('')
    setFolderId('')
    setSelectedTags([])
    setNotes('')

    // Set initial folder or tag based on selectedContent
    const selectedFolder = folders.find(folder => folder.name === selectedContent)
    const selectedTag = tags.find(tag => tag.name === selectedContent)

    if (selectedFolder) {
      setFolderId(selectedFolder.id)
    } else if (selectedTag) {
      setSelectedTags([selectedTag.id])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bookmarkData = {
      title,
      url,
      folderId: folderId || null,
      tags: selectedTags,
      notes,
    }

    if (editingBookmark) {
      editBookmark(editingBookmark.id, bookmarkData)
    } else {
      addBookmark(bookmarkData)
    }

    setIsAddBookmarkModalOpen(false)
  }

  return (
    <Dialog open={isAddBookmarkModalOpen} onOpenChange={setIsAddBookmarkModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="folder">Folder</Label>
            <Select value={folderId} onValueChange={setFolderId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Select
              value={selectedTags[0] || ''}
              onValueChange={(value) => setSelectedTags([value])}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsAddBookmarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingBookmark ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}