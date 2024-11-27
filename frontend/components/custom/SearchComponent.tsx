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
interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
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

    // Validate file type
    if (!selectedFile.type.includes('html')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an HTML file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
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

      const response = await axiosClient.post("/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchFolders()
      await fetchBookmark()

      toast({
        title: "Success",
        description: "Bookmarks imported successfully!",
      });

      // Close dialog and reset file
      setIsDialogOpen(false);
      setSelectedFile(null);

    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error.response?.data?.message || "An error occurred while importing bookmarks.",
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
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.response?.data?.message || "Failed to export bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center w-full max-w-3xl">
        <div className="relative flex-1 max-w-sm">
          <Input
            ref={inputRef}
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className='flex gap-2 ml-4'>
          <Button
            onClick={() => {
              setEditingBookmark(null);
              setIsAddBookmarkModalOpen(true);
            }}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                disabled={isLoading}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center p-2"
                disabled={isLoading}
              >
                <Import className="mr-2 h-4 w-4" />
                <span className="flex-1">Import Bookmarks</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center p-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span className="flex-1">Export Bookmarks</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Bookmarks</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
              >
                Choose File
                <input
                  id="file-upload"
                  type="file"
                  accept=".html"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Button>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
              <Button
                onClick={handleFileUpload}
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;