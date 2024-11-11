import React from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FolderSection } from './folder-section'
import { TagSection } from './tag-section'

interface SidebarItemsProps {
  folders: { name: string; content: string }[]
  tags: string[]
  selectedContent: string
  setSelectedContent: (content: string) => void
  setFolders: React.Dispatch<React.SetStateAction<{ name: string; content: string }[]>>
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export function SidebarItems({
  folders,
  tags,
  selectedContent,
  setSelectedContent,
  setFolders,
  setTags,
}: SidebarItemsProps) {
  return (
    <nav className="space-y-2 p-2">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setSelectedContent('All Bookmarks')}
      >
        <Bookmark className="mr-2 h-4 w-4" />
        All Bookmarks
      </Button>
      <FolderSection
        folders={folders}
        setFolders={setFolders}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
      <TagSection
        tags={tags}
        setTags={setTags}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
    </nav>
  )
}