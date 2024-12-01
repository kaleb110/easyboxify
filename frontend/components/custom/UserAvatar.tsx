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
          <Avatar className="h-10 w-10 mr-3 hover:cursor-pointer">
            <AvatarImage src="/placeholder-avatar.jpg" alt={Name} />
            <AvatarFallback>{Name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-3.5 w-3.5" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSetting}>
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
            {
              Plan === "free" ? <span className="font-medium text-yellow-500">Upgrade to Pro</span> : <span className="font-medium text-yellow-500">Pro Version</span>
            }
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