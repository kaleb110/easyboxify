// store/bookmarkStore.ts
import { create } from "zustand";

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
  editingFolderId: string | null;
  editingTagId: string | null;
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
  setEditingFolderId: (id: string | null) => void;
  setEditingTagId: (id: string | null) => void;
  moveBookmark: (bookmarkId: string, targetFolderId: string | null) => void;
  reorderBookmarks: (startIndex: number, endIndex: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  folders: [
    { id: "1", name: "Work", isCollapsed: false },
    { id: "2", name: "Personal", isCollapsed: false },
    { id: "3", name: "Learning", isCollapsed: false },
  ],
  tags: [
    { id: "1", name: "Important" },
    { id: "2", name: "Read Later" },
    { id: "3", name: "Inspiration" },
  ],
  bookmarks: [],
  selectedContent: "All Bookmarks",
  isAddBookmarkModalOpen: false,
  editingBookmark: null,
  editingFolderId: null,
  editingTagId: null,
  addFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        { id: Date.now().toString(), name, isCollapsed: false },
      ],
    })),
  renameFolder: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      ),
    })),
  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.folderId === id ? { ...bookmark, folderId: null } : bookmark
      ),
    })),
  toggleFolderCollapse: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? { ...folder, isCollapsed: !folder.isCollapsed }
          : folder
      ),
    })),
  addTag: (name) =>
    set((state) => ({
      tags: [...state.tags, { id: Date.now().toString(), name }],
    })),
  renameTag: (id, newName) =>
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, name: newName } : tag
      ),
    })),
  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      bookmarks: state.bookmarks.map((bookmark) => ({
        ...bookmark,
        tags: bookmark.tags.filter((tagId) => tagId !== id),
      })),
    })),
  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [
        ...state.bookmarks,
        { ...bookmark, id: Date.now().toString() },
      ],
    })),
  editBookmark: (id, updatedBookmark) =>
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, ...updatedBookmark } : bookmark
      ),
    })),
  deleteBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
    })),
  setSelectedContent: (content) => set({ selectedContent: content }),
  setIsAddBookmarkModalOpen: (isOpen) =>
    set({ isAddBookmarkModalOpen: isOpen }),
  setEditingBookmark: (bookmark) => set({ editingBookmark: bookmark }),
  setEditingFolderId: (id) => set({ editingFolderId: id }),
  setEditingTagId: (id) => set({ editingTagId: id }),
  moveBookmark: (bookmarkId, targetFolderId) =>
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, folderId: targetFolderId }
          : bookmark
      ),
    })),
  reorderBookmarks: (startIndex, endIndex) =>
    set((state) => {
      const newBookmarks = Array.from(state.bookmarks);
      const [reorderedItem] = newBookmarks.splice(startIndex, 1);
      newBookmarks.splice(endIndex, 0, reorderedItem);
      return { bookmarks: newBookmarks };
    }),
}));
