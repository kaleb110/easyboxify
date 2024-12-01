"use client"
import React, { useState } from 'react'
import { Tag, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useBookmarkStore } from '@/store/bookmarkStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useEffect } from 'react'

interface TagSectionProps {
  onItemClick: () => void
}

export function TagSection({ onItemClick }: TagSectionProps) {
  const {
    tags,
    addTag,
    fetchTags,
    setSelectedContent,
    selectedContent
  } = useBookmarkStore()
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await fetchTags()
    }

    fetchData()
  }, [])

  const handleAddTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('tagName') as HTMLInputElement;

    // Check if the tag name is already taken
    if (tags.some((tag) => tag.name.toLowerCase() === nameInput.value.trim().toLowerCase())) {
      nameInput.setCustomValidity('Tag name already exists');
      form.reportValidity();
      return;
    }

    nameInput.setCustomValidity(''); // Clear any validation errors

    try {
      await addTag(nameInput.value.trim());
      setSelectedContent(nameInput.value.trim());
      setNewTagName('');
      setIsAddingTag(false);
      onItemClick();
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };



  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingTag(true)
  }

  return (
    <>
      <Collapsible
        defaultOpen
        open={!isCollapsed}
        onOpenChange={(open) => setIsCollapsed(!open)}
      >
        <div className="flex items-center justify-between py-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 hover:bg-accent hover:text-accent-foreground">
              <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
              <Tag className="mr-2 h-5 w-5 text-emerald-500" />
              <span className="text-lg font-semibold">Tags</span>
            </Button>
          </CollapsibleTrigger>
          <Button variant="ghost" size="icon" onClick={handleAddButtonClick} className="hover:bg-accent hover:text-accent-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <CollapsibleContent className="space-y-1 ml-6">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center">
              <Button
                variant="ghost"
                className={`w-full justify-start py-1 px-2 text-sm hover:bg-accent hover:text-accent-foreground font-body ${selectedContent === tag.name ? 'bg-accent' : ''}`}
                onClick={() => {
                  setSelectedContent(tag.name)
                  onItemClick()
                }}
              >
                <Tag className="mr-2 h-4 w-4 text-emerald-400" />
                {tag.name}
              </Button>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTag}>
            <Input
              name="tagName"
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value)
                e.target.setCustomValidity('')
              }}
              placeholder="Enter tag name"
              className="mt-4"
              required
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddingTag(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Tag</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}