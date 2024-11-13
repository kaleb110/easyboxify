import React from 'react'
import { FolderSection } from './folder-section'
import { TagSection } from './tag-section'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import UserAvatar from '../custom/UserAvatar'
export function SidebarItems({ onItemClick }: { onItemClick: () => void }) {
  const { setSelectedContent } = useBookmarkStore()

  return (
    <div className="space-y-1 flex flex-col justify-start">
      <div className='max-sm:hidden pl-2'>
        <UserAvatar />
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          setSelectedContent('All Bookmarks')
          onItemClick()
        }}
      >
        <Bookmark className="mr-2 h-4 w-4" />
        All Bookmarks
      </Button>
      <FolderSection onItemClick={onItemClick} />
      <TagSection onItemClick={onItemClick} />
    </div>
  )
}