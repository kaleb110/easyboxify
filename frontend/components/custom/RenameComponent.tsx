import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { RefObject } from 'react'

interface RenameProps {
  renameFormRef: RefObject<HTMLFormElement> | null;
  itemToDelete: { type: 'folder' | 'tag'; id: string; name: string } | null;
  setItemToDelete: (item: { type: 'folder' | 'tag'; id: string; name: string } | null) => void;
}

const RenameComponent: React.FC<RenameProps> = ({ renameFormRef, itemToDelete, setItemToDelete }) => {
  const
    {
      isRenameDialogOpen, setIsRenameDialogOpen, selectedContent, setEditingName, isDeleteDialogOpen, setIsDeleteDialogOpen, editingName, deleteFolder, deleteTag, setSelectedContent, renameFolder, renameTag, folders, tags
    } = useBookmarkStore()
  
  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingName.trim() && editingName.trim() !== selectedContent) {
      const folder = folders.find(f => f.name === selectedContent)
      if (folder) {
        renameFolder(folder.id, editingName.trim())
      } else {
        const tag = tags.find(t => t.name === selectedContent)
        if (tag) {
          renameTag(tag.id, editingName.trim())
        }
      }
      setSelectedContent(editingName.trim())
      setIsRenameDialogOpen(false)
    } else {
      if (renameFormRef?.current) {
        const input = renameFormRef.current.querySelector('input')
        if (input) {
          input.reportValidity()
        }
      }
    }
  }

  return (
    <>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedContent}</DialogTitle>
          </DialogHeader>
          <form ref={renameFormRef} onSubmit={handleRename}>
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter new name"
              className="mt-4"
              required
              minLength={1}
              pattern={`^(?!${selectedContent}$).+`}
              title="New name must be different from the current name"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>Rename</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {itemToDelete ? ` "${itemToDelete.name}" ${itemToDelete.type}` : ''} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (itemToDelete) {
                if (itemToDelete.type === 'folder') {
                  deleteFolder(itemToDelete.id)
                } else if (itemToDelete.type === 'tag') {
                  deleteTag(itemToDelete.id)
                }
                setSelectedContent('All Bookmarks')
              }
              setIsDeleteDialogOpen(false)
              setItemToDelete(null)
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default RenameComponent