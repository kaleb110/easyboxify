import React from 'react'
import { SidebarItems } from '../sidebar/sidebar-items'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '../custom/UserAvatar'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { useEffect } from 'react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface SidebarProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  toggleSidebar: () => void
}
const SidebarComponent: React.FC<SidebarProps> = ({open, setOpen, toggleSidebar}) => {
  const { setIsMobile, isMobile, setSearchTerm } = useBookmarkStore()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setOpen, setIsMobile])

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setOpen(false)
    }
    setSearchTerm('') // Reset search term when changing tabs
  }

  return (
    <Sidebar className="border-r border-border bg-background" open={open} onOpenChange={setOpen}>
      <SidebarHeader className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bookmarks</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-transparent">
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-grow overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="p-4">
            <SidebarItems onItemClick={handleSidebarItemClick} />
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  )
}

export default SidebarComponent