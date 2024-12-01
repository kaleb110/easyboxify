'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, X, Plus, ChevronDown, Import, Upload } from 'lucide-react';
import { useBookmarkStore } from '@/store/bookmarkStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/util/axiosClient';
import UserAvatar from './UserAvatar';
import { AxiosError } from 'axios';
interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

interface ErrorResponse {
  error: string;
}

const SearchComponent: React.FC<SearchProps> = React.memo(({ searchTerm, setSearchTerm }) => {
  const { setIsAddBookmarkModalOpen, setEditingBookmark, fetchFolders, fetchBookmark } = useBookmarkStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile.type.includes('html')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an HTML file",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axiosClient.post("/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchFolders();
      await fetchBookmark();

      toast({
        title: "Success",
        description: "Bookmarks imported successfully!",
      });

      setIsDialogOpen(false);
      setSelectedFile(null);

    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: axiosError.response?.data?.error || "An error occurred while importing bookmarks.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get("/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookmarks-${new Date().toISOString().split('T')[0]}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Bookmarks exported successfully",
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast({
        title: "Export failed",
        description: axiosError.response?.data?.error || "Failed to export bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full py-2'>
      <div className="flex items-center justify-between gap-x-4 max-w-[1400px] mx-auto">
        {/* Search Bar */}
        <div className="relative w-full max-w-[400px] lg:max-w-[370px]">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 pl-8 pr-8 text-sm bg-background/60 backdrop-blur-sm"
          />
          <Search
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-background/80"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-6 w-6" size={28} />
            </Button>
          )}
        </div>

        {/* Actions Group */}
        <div className='flex items-center gap-x-2'>
          {/* Add Button Group */}
          <div className="flex items-center">
            <Button
              onClick={() => {
                setEditingBookmark(null);
                setIsAddBookmarkModalOpen(true);
              }}
              size="sm"
              className="rounded-r-none px-2.5 h-8 text-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-l-none border-l border-border/50 px-1.5 h-8"
                  disabled={isLoading}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center py-1.5 px-2.5 cursor-pointer text-sm"
                  disabled={isLoading}
                >
                  <Import className="mr-2 h-3.5 w-3.5" />
                  <span>Import</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleExport}
                  disabled={isLoading}
                  className="flex items-center py-1.5 px-2.5 cursor-pointer text-sm"
                >
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  <span>Export</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Avatar */}
          <UserAvatar  />
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Import Bookmarks
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              variant="outline"
              className="w-full h-20 flex flex-col gap-1"
            >
              <Upload className="h-5 w-5 mb-1" />
              <span>Choose File</span>
              <input
                id="file-upload"
                type="file"
                accept=".html"
                onChange={handleFileChange}
                className="hidden"
              />
            </Button>

            {selectedFile && (
              <p className="text-sm text-muted-foreground text-center">
                Selected: {selectedFile.name}
              </p>
            )}

            <Button
              onClick={handleFileUpload}
              disabled={isLoading || !selectedFile}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Uploading...
                </span>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;