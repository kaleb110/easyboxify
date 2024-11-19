import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { BookmarkStore } from "../types/store";

const defaultFolders = ["Personal", "Work", "Learning"];
const defaultTags = ["Important", "To-Read", "Favorite"];

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

  isMobile: false,
  searchTerm: "",
  editingName: "",
  isRenameDialogOpen: false,
  isDeleteDialogOpen: false,

  // State setters
  setIsMobile: (isMobile) => set({ isMobile }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setEditingName: (name) => set({ editingName: name }),
  setIsRenameDialogOpen: (isOpen) => set({ isRenameDialogOpen: isOpen }),
  setIsDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),

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
