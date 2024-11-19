export interface Folder {
  id: string;
  name: string;
  isCollapsed: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string | null;
  tags: string[];
  notes: string;
}

interface BookmarkStore {
  folders: Folder[];
  tags: Tag[];
  bookmarks: Bookmark[];
  selectedContent: string;
  isAddBookmarkModalOpen: boolean;
  editingBookmark: Bookmark | null;

  isMobile: boolean;
  searchTerm: string;
  editingName: string;
  isRenameDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  setIsMobile: (isMobile: boolean) => void;
  setSearchTerm: (term: string) => void;
  setEditingName: (name: string) => void;
  setIsRenameDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  
  addFolder: (name: string) => void;
  renameFolder: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;
  toggleFolderCollapse: (id: string) => void;
  addTag: (name: string) => void;
  renameTag: (id: string, newName: string) => void;
  deleteTag: (id: string) => void;
  addBookmark: (bookmark: Omit<Bookmark, "id">) => void;
  editBookmark: (id: string, updatedBookmark: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  setSelectedContent: (content: string) => void;
  setIsAddBookmarkModalOpen: (isOpen: boolean) => void;
  setEditingBookmark: (bookmark: Bookmark | null) => void;
  reorderBookmarks: (dragIndex: number, hoverIndex: number) => void;
}