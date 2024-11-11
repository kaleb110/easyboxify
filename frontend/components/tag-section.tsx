import React, { useState, useRef } from 'react'
import { Hash, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useClickOutside } from '@/hooks/use-click-outside'

interface TagSectionProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  selectedContent: string
  setSelectedContent: (content: string) => void
}

export function TagSection({
  tags,
  setTags,
  setSelectedContent,
}: TagSectionProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [tagInputWarning, setTagInputWarning] = useState('')

  const tagInputRef = useRef<HTMLInputElement>(null)

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newTagName.trim()) {
        const newTag = newTagName.trim()
        setTags(prev => [...prev, newTag])
        setNewTagName('')
        setTagInputWarning('')
        setIsAddingTag(false)
        setSelectedContent(`Tag: ${newTag}`)
      } else {
        setTagInputWarning('Please enter a tag name')
      }
      e.preventDefault()
    }
  }

  useClickOutside(tagInputRef, () => {
    if (newTagName.trim()) {
      const newTag = newTagName.trim()
      setTags(prev => [...prev, newTag])
      setNewTagName('')
      setSelectedContent(`Tag: ${newTag}`)
    }
    setIsAddingTag(false)
    setTagInputWarning('')
  })

  return (
    <Collapsible defaultOpen>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Hash className="mr-2 h-4 w-4" />
            Tags
          </Button>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" onClick={() => setIsAddingTag(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleContent className="space-y-1 mt-1">
        {isAddingTag && (
          <div className="mb-1 pl-6">
            <Input
              ref={tagInputRef}
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="New tag name"
              className="h-8 text-sm"
              autoFocus
            />
            {tagInputWarning && <p className="text-red-500 text-xs mt-1">{tagInputWarning}</p>}
          </div>
        )}
        {tags.map((tag) => (
          <Button
            key={tag}
            variant="ghost"
            className="w-full justify-start pl-6 text-sm"
            onClick={() => setSelectedContent(`Tag: ${tag}`)}
          >
            <Hash className="mr-2 h-4 w-4" />
            {tag}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}