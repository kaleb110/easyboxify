import React from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FolderSection } from './folder-section'
import { TagSection } from './tag-section'
import { useBookmarkStore } from '@/store/bookmarkStore'

export function SidebarItems() {
  const { selectedContent, setSelectedContent } = useBookmarkStore()

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
      <FolderSection />
      <TagSection />
    </nav>
  )
}