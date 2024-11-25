"use client"

import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { User, Settings, HelpCircle, LogOut, Moon, Sun, Laptop, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIStore } from '@/store/useUiStore';
import { useBookmarkStore } from '@/store/bookmarkStore';

const UserAvatar = () => {
  
  const { Logout } = useAuthStore();
  const { userName, userEmail, setUserInfo } = useBookmarkStore()
  const router = useRouter();
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      await setUserInfo()
    }

    fetchData()
  }, [])
  
  const handleLogout = () => {
    Logout(); // This will clear the authentication state and token
    router.replace('/auth/login'); // Redirect to login page after logout
  };

  const handleUpgradeClick = () => {
    useUIStore.getState().setShowUpgradeModal(true); // Show the upgrade modal
  };

  const Name = userName; // Replace with actual user name
  const Email = userEmail; // Replace with actual user email

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center w-full">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder-avatar.jpg" alt={Name} />
                <AvatarFallback>{Name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{Name}</span>
                <span className="text-xs text-muted-foreground">{Email}</span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUpgradeClick}>
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="font-medium text-yellow-500">Upgrade to Pro</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === 'dark' ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : theme === 'light' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Laptop className="mr-2 h-4 w-4" />
              )}
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;