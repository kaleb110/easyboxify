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
import { Settings,  LogOut, Moon, Sun, Laptop, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIStore } from '@/store/useUiStore';
import { useBookmarkStore } from '@/store/bookmarkStore';

const UserAvatar = () => {
  
  const { Logout } = useAuthStore();
  const { userName, userPlan, setUserInfo } = useBookmarkStore()
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

  const handleSetting = () => {
    router.push("/setting")
  };

  const handleUpgradeClick = () => {
    useUIStore.getState().setShowUpgradeModal(true); // Show the upgrade modal
  };

  const Name = userName; // Replace with actual user name
  const Plan = userPlan

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 mr-3 hover:cursor-pointer">
            <AvatarImage src="/placeholder-avatar.jpg" alt={Name} />
            <AvatarFallback>{Name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSetting}>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUpgradeClick}>
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            {
              Plan === "free" ? <span className="font-medium text-yellow-500">Upgrade to Pro</span> : <span className="font-medium text-yellow-500">Pro Version</span>
            }
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 mr-2" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Laptop className="w-4 h-4 mr-2" />
              )}
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Laptop className="w-4 h-4 mr-2" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;