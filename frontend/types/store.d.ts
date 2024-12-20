export interface Folder {
  id: string;
  name: string;
  isCollapsed: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string | null;
  tags: Tag[];
  description: string;
  createdAt: string;
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
  userName: string;
  userEmail: string;
  userPlan: string;
  userStatus: string;
  subscriptionStatus: string;

  // State setters
  getSortPreference: () => Promise<string>;
  setSortPreference: (sortPreference: string) => Promise<void>;
  getLayoutPreference: () => Promise<string>;
  setLayoutPreference: (layoutPreference: string) => Promise<void>;
  setUserInfo: () => Promise<void>;
  setIsMobile: (isMobile: boolean) => void;
  setSearchTerm: (term: string) => void;
  setEditingName: (name: string) => void;
  setIsRenameDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;

  fetchFolders: () => Promise<void>;
  fetchBookmark: () => Promise<void>;
  fetchTags: () => Promise<void>;
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
}
