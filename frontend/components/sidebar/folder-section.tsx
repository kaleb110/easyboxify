import React, { useState } from 'react'
import { FolderClosed, Plus, ChevronRight } from 'lucide-react'
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

interface FolderSectionProps {
  onItemClick: () => void
}

export function FolderSection({ onItemClick }: FolderSectionProps) {
  const {
    folders,
    addFolder,
    setSelectedContent,
    toggleFolderCollapse,
  } = useBookmarkStore()
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleAddFolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nameInput = form.elements.namedItem('folderName') as HTMLInputElement

    if (folders.some(folder => folder.name.toLowerCase() === nameInput.value.trim().toLowerCase())) {
      nameInput.setCustomValidity('Folder name already exists')
      form.reportValidity()
      return
    }

    nameInput.setCustomValidity('')
    addFolder(nameInput.value.trim())
    setNewFolderName('')
    setIsAddingFolder(false)
    setSelectedContent(nameInput.value.trim())
    onItemClick()
  }

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsAddingFolder(true)
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
              <FolderClosed className="mr-2 h-5 w-5 text-indigo-500" />
              <span className="text-lg font-semibold">Folders</span>
            </Button>
          </CollapsibleTrigger>
          <Button variant="ghost" size="icon" onClick={handleAddButtonClick} className="hover:bg-accent hover:text-accent-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <CollapsibleContent className="space-y-1 ml-6">
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

      <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFolder}>
            <Input
              name="folderName"
              value={newFolderName}
              onChange={(e) => {
                setNewFolderName(e.target.value)
                e.target.setCustomValidity('')
              }}
              placeholder="Enter folder name"
              className="mt-4"
              required
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddingFolder(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Folder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}