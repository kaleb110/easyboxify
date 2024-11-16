import React from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FolderSection } from './folder-section'
import { TagSection } from './tag-section'
import { useBookmarkStore } from '@/store/bookmarkStore'

export function SidebarItems({ onItemClick }: { onItemClick: () => void }) {
  const { setSelectedContent } = useBookmarkStore()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <Button
          variant="ghost"
          className="w-full justify-start mb-4 p-2 text-lg font-semibold hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            setSelectedContent('All Bookmarks')
            onItemClick()
          }}
        >
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          All Bookmarks
        </Button>
        <FolderSection onItemClick={onItemClick} />
        <TagSection onItemClick={onItemClick} />
      </div>
    </div>
  )
}