"use client"
import React, { useState } from 'react'
import { FolderClosed, Plus, ChevronRight, Loader2 } from 'lucide-react'
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

interface FolderSectionProps {
  onItemClick: () => void
}

export function FolderSection({ onItemClick }: FolderSectionProps) {
  const {
    folders,
    fetchFolders,
    addFolder,
    setSelectedContent,
    toggleFolderCollapse,
    selectedContent
  } = useBookmarkStore()
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await fetchFolders()
    }
    
    fetchData()
    
  }, [])
  
  const handleAddFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)    
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('folderName') as HTMLInputElement;

    // Check if the folder name is already taken
    if (folders.some((folder) => folder.name.toLowerCase() === nameInput.value.trim().toLowerCase())) {
      nameInput.setCustomValidity('Folder name already exists');
      form.reportValidity();
      return;
    }

    nameInput.setCustomValidity('');
    try {
      await addFolder(nameInput.value.trim());
      setSelectedContent(nameInput.value.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
      onItemClick();
    } catch (error) {
      console.error('Failed to add folder:', error);
    } finally {
      setIsLoading(false)
    }
  };


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
            <Button variant="ghost" className="justify-start w-full p-2 hover:bg-accent hover:text-accent-foreground">
              <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
              <FolderClosed className="w-5 h-5 mr-2 text-indigo-500 font-body" />
              <span className="text-lg font-semibold font-body">Folders</span>
            </Button>
          </CollapsibleTrigger>
          <Button variant="ghost" size="icon" onClick={handleAddButtonClick} className="hover:bg-accent hover:text-accent-foreground">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <CollapsibleContent className="ml-6 space-y-1">
          {folders.map((folder) => (
            <Collapsible key={folder.id} open={!folder.isCollapsed}>
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start py-1 px-2 text-sm hover:bg-accent hover:text-accent-foreground font-body ${selectedContent === folder.name ? 'bg-accent' : ''}`}
                    onClick={() => {
                      toggleFolderCollapse(folder.id)
                      setSelectedContent(folder.name)
                      onItemClick()
                    }}
                  >
                    <FolderClosed className="w-4 h-4 mr-2 text-indigo-400" />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Add Folder'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}