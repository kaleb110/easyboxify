import React, { useState, useRef, useEffect } from 'react'
import { Tag, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useBookmarkStore } from '@/store/bookmarkStore'

export function TagSection({ onItemClick }: { onItemClick: () => void }) {
  const {
    tags,
    addTag,
    setSelectedContent,
  } = useBookmarkStore()
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false) // New state
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingTag) {
      inputRef.current?.focus()
    }
  }, [isAddingTag])

  const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTagName.trim()) {
      if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
        if (inputRef.current) {
          inputRef.current.setCustomValidity('Tag name already exists')
          inputRef.current.reportValidity()
        }
      } else {
        addTag(newTagName.trim())
        setNewTagName('')
        setIsAddingTag(false)
        setSelectedContent(newTagName.trim())
      }
    }
  }

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingTag(true)
  }

  const handleInputBlur = () => {
    setIsAddingTag(false)
    setNewTagName('')
    setIsInputFocused(false) // Update focus state
  }

  return (
    <Collapsible
      defaultOpen
      open={!isCollapsed}
      onOpenChange={(open) => {
        if (!isInputFocused) setIsCollapsed(!open) // Respect focus state
      }}
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
        {isAddingTag && (
          <form onSubmit={handleAddTag} className="mb-2">
            <Input
              ref={inputRef}
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value)
                e.currentTarget.setCustomValidity('')
              }}
              onFocus={() => setIsInputFocused(true)} // Update focus state
              onBlur={handleInputBlur}
              placeholder="New tag name"
              className="h-8 text-sm"
              required
            />
          </form>
        )}
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center">
            <Button
              variant="ghost"
              className="w-full justify-start py-1 px-2 text-sm hover:bg-accent hover:text-accent-foreground"
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
  )
}
