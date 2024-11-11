import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from './tag-input'

interface AddBookmarkModalProps {
  folders: { name: string; content: string }[]
  onAddBookmark: (bookmark: BookmarkType) => void
  editingBookmark: BookmarkType | null
  onEditBookmark: (bookmark: BookmarkType) => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface BookmarkType {
  id: string
  title: string
  url: string
  folder: string
  tags: string[]
  notes: string
}

export function AddBookmarkModal({
  folders,
  onAddBookmark,
  editingBookmark,
  onEditBookmark,
  isOpen,
  setIsOpen
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [folder, setFolder] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [urlWarning, setUrlWarning] = useState('')

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title)
      setUrl(editingBookmark.url)
      setFolder(editingBookmark.folder)
      setTags(editingBookmark.tags)
      setNotes(editingBookmark.notes)
    } else {
      resetForm()
    }
  }, [editingBookmark, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setUrlWarning('Please enter a valid URL')
      return
    }
    const bookmarkData = {
      id: editingBookmark ? editingBookmark.id : Date.now().toString(),
      title: title.trim() || url,
      url: url.trim(),
      folder,
      tags,
      notes
    }
    if (editingBookmark) {
      onEditBookmark(bookmarkData)
    } else {
      onAddBookmark(bookmarkData)
    }
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setUrl('')
    setFolder('')
    setTags([])
    setNotes('')
    setUrlWarning('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="url" className="text-right">
              URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setUrlWarning('')
              }}
              className="col-span-3"
              required
              placeholder="https://example.com"
            />
          </div>
          {urlWarning && <p className="text-red-500 text-sm">{urlWarning}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="folder" className="text-right">
              Folder
            </label>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f.name} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tags" className="text-right">
              Tags
            </label>
            <div className="col-span-3">
              <TagInput tags={tags} setTags={setTags} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">{editingBookmark ? 'Update' : 'Add'} Bookmark</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}