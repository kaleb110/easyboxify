import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

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

const defaultFolders = ["Personal", "Work", "Learning"];
const defaultTags = ["Important", "To-Read", "Favorite"];

interface BookmarkStore {
  folders: Folder[];
  tags: Tag[];
  bookmarks: Bookmark[];
  selectedContent: string;
  isAddBookmarkModalOpen: boolean;
  editingBookmark: Bookmark | null;
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

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  folders: defaultFolders.map((name) => ({
    id: uuidv4(),
    name,
    isCollapsed: false,
  })),
  tags: defaultTags.map((name) => ({ id: uuidv4(), name })),
  bookmarks: [],
  selectedContent: "All Bookmarks",
  isAddBookmarkModalOpen: false,
  editingBookmark: null,

  addFolder: (name) =>
    set((state) => ({
      folders: [...state.folders, { id: uuidv4(), name, isCollapsed: false }],
    })),

  renameFolder: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      ),
      selectedContent:
        state.selectedContent === state.folders.find((f) => f.id === id)?.name
          ? newName
          : state.selectedContent,
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.folderId !== id),
      selectedContent: "All Bookmarks",
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
      tags: [...state.tags, { id: uuidv4(), name }],
    })),

  renameTag: (id, newName) =>
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, name: newName } : tag
      ),
      selectedContent:
        state.selectedContent === state.tags.find((t) => t.id === id)?.name
          ? newName
          : state.selectedContent,
    })),

  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      bookmarks: state.bookmarks.filter(
        (bookmark) => !bookmark.tags.includes(id)
      ),
      selectedContent: "All Bookmarks",
    })),

  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, { ...bookmark, id: uuidv4() }],
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

  reorderBookmarks: (dragIndex, hoverIndex) =>
    set((state) => {
      const newBookmarks = [...state.bookmarks];
      const draggedBookmark = newBookmarks[dragIndex];
      newBookmarks.splice(dragIndex, 1);
      newBookmarks.splice(hoverIndex, 0, draggedBookmark);
      return { bookmarks: newBookmarks };
    }),
}));
