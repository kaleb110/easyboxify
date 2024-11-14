import React, { useState, useRef, useEffect } from 'react'
import { Tag, Plus } from 'lucide-react'
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
  //const [errorMessage, setErrorMessage] = useState('') //Removed errorMessage state
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

  const handleAddButtonClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingTag(true)
  }

  const handleInputBlur = () => {
    setIsAddingTag(false)
    setNewTagName('')
  }

  return (
    <Collapsible
      defaultOpen
      open={!isCollapsed}
      onOpenChange={(open) => setIsCollapsed(!open)}
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Tag className="mr-2 h-4 w-4" />
            Tags
          </Button>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" onClick={handleAddButtonClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleContent className="space-y-1 mt-1">
        {isAddingTag && (
          <form onSubmit={handleAddTag} className="mb-1 pl-6">
            <Input
              ref={inputRef}
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value)
                e.currentTarget.setCustomValidity('')
              }}
              onBlur={handleInputBlur}
              placeholder="New tag name"
              className="h-8 text-sm"
              required
            />
            {/* {errorMessage && ( //Removed errorMessage display
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )} */}
          </form>
        )}
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center">
            <Button
              variant="ghost"
              className="w-full justify-start pl-6 text-sm"
              onClick={() => {
                setSelectedContent(tag.name)
                onItemClick()
              }}
            >
              <Tag className="mr-2 h-4 w-4" />
              {tag.name}
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}