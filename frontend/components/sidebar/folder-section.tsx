import React, { useState, useRef, useEffect } from 'react'
import { FolderClosed, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useBookmarkStore } from '@/store/bookmarkStore'

export function FolderSection({ onItemClick }: { onItemClick: () => void }) {
  const {
    folders,
    addFolder,
    setSelectedContent,
    toggleFolderCollapse,
  } = useBookmarkStore()
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [preventCollapse, setPreventCollapse] = useState(false) // New flag to prevent collapsing
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingFolder) {
      inputRef.current?.focus()
    }
  }, [isAddingFolder])

  const handleAddFolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newFolderName.trim()) {
      if (folders.some(folder => folder.name.toLowerCase() === newFolderName.trim().toLowerCase())) {
        if (inputRef.current) {
          inputRef.current.setCustomValidity('Folder name already exists')
          inputRef.current.reportValidity()
        }
      } else {
        addFolder(newFolderName.trim())
        setNewFolderName('')
        setIsAddingFolder(false)
        setSelectedContent(newFolderName.trim())
      }
    }
  }

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingFolder(true)
  }

  const handleInputBlur = () => {
    setNewFolderName('')
    setIsAddingFolder(false)
    setPreventCollapse(false) // Allow collapsing after input blur
  }

  return (
    <Collapsible
      defaultOpen
      open={!isCollapsed || preventCollapse} // Prevent collapse when input is focused
      onOpenChange={(open) => {
        if (!preventCollapse) setIsCollapsed(!open) // Only change collapse state if allowed
      }}
    >
      <div className="flex items-center justify-between py-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 hover:bg-accent hover:text-accent-foreground">
            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
            <FolderClosed className="mr-2 h-5 w-5 text-indigo-500" />
            <span className="text-lg font-semibold">Folders</span>
          </Button>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" onClick={handleAddButtonClick} className="hover:bg-accent hover:text-accent-foreground">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleContent className="space-y-1 ml-6">
        {isAddingFolder && (
          <form onSubmit={handleAddFolder} className="mb-2">
            <Input
              ref={inputRef}
              value={newFolderName}
              onChange={(e) => {
                setNewFolderName(e.target.value)
                e.currentTarget.setCustomValidity('')
              }}
              onFocus={() => setPreventCollapse(true)} // Prevent collapsing when input is focused
              onBlur={handleInputBlur}
              placeholder="New folder name"
              className="h-8 text-sm"
              required
            />
          </form>
        )}
        {folders.map((folder) => (
          <Collapsible key={folder.id} open={!folder.isCollapsed}>
            <div className="flex items-center">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start py-1 px-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    toggleFolderCollapse(folder.id)
                    setSelectedContent(folder.name)
                    onItemClick()
                  }}
                >
                  <FolderClosed className="mr-2 h-4 w-4 text-indigo-400" />
                  {folder.name}
                </Button>
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
