import React, { useState, useRef, useEffect } from 'react'
import { FolderClosed, Plus } from 'lucide-react'
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
  //const [errorMessage, setErrorMessage] = useState('') //Removed errorMessage state
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

  const handleAddButtonClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingFolder(true)
  }

  const handleInputBlur = () => {
    setIsAddingFolder(false)
    setNewFolderName('')
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
            <FolderClosed className="mr-2 h-4 w-4" />
            Folders
          </Button>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" onClick={handleAddButtonClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleContent className="space-y-1 mt-1">
        {isAddingFolder && (
          <form onSubmit={handleAddFolder} className="mb-1 pl-6">
            <Input
              ref={inputRef}
              value={newFolderName}
              onChange={(e) => {
                setNewFolderName(e.target.value)
                e.currentTarget.setCustomValidity('')
              }}
              onBlur={handleInputBlur}
              placeholder="New folder name"
              className="h-8 text-sm"
              required
            />
            {/* {errorMessage && ( //Removed errorMessage display
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )} */}
          </form>
        )}
        {folders.map((folder) => (
          <Collapsible key={folder.id} open={!folder.isCollapsed}>
            <div className="flex items-center">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-6 text-sm"
                  onClick={() => {
                    toggleFolderCollapse(folder.id)
                    setSelectedContent(folder.name)
                    onItemClick()
                  }}
                >
                  <FolderClosed className="mr-2 h-4 w-4" />
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