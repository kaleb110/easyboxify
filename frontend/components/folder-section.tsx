import React, { useState, useRef } from 'react'
import { FolderClosed, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useClickOutside } from '@/hooks/use-click-outside'

interface FolderSectionProps {
  folders: { name: string; content: string }[]
  setFolders: React.Dispatch<React.SetStateAction<{ name: string; content: string }[]>>
  selectedContent: string
  setSelectedContent: (content: string) => void
}

export function FolderSection({
  folders,
  setFolders,
  setSelectedContent,
}: FolderSectionProps) {
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [folderInputWarning, setFolderInputWarning] = useState('')

  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleAddFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newFolderName.trim()) {
        const newFolder = { name: newFolderName.trim(), content: `${newFolderName.trim()} content goes here` }
        setFolders(prev => [...prev, newFolder])
        setNewFolderName('')
        setFolderInputWarning('')
        setIsAddingFolder(false)
        setSelectedContent(newFolder.name)
      } else {
        setFolderInputWarning('Please enter a folder name')
      }
      e.preventDefault()
    }
  }

  useClickOutside(folderInputRef, () => {
    if (newFolderName.trim()) {
      const newFolder = { name: newFolderName.trim(), content: `${newFolderName.trim()} content goes here` }
      setFolders(prev => [...prev, newFolder])
      setNewFolderName('')
      setSelectedContent(newFolder.name)
    }
    setIsAddingFolder(false)
    setFolderInputWarning('')
  })

  return (
    <Collapsible defaultOpen>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <FolderClosed className="mr-2 h-4 w-4" />
            Folders
          </Button>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" onClick={() => setIsAddingFolder(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleContent className="space-y-1 mt-1">
        {isAddingFolder && (
          <div className="mb-1 pl-6">
            <Input
              ref={folderInputRef}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleAddFolder}
              placeholder="New folder name"
              className="h-8 text-sm"
              autoFocus
            />
            {folderInputWarning && <p className="text-red-500 text-xs mt-1">{folderInputWarning}</p>}
          </div>
        )}
        {folders.map((folder) => (
          <Button
            key={folder.name}
            variant="ghost"
            className="w-full justify-start pl-6 text-sm"
            onClick={() => setSelectedContent(folder.name)}
          >
            <FolderClosed className="mr-2 h-4 w-4" />
            {folder.name}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}