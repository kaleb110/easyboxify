import { create } from "zustand";
import axiosClient from "@/util/axiosClient";
import { BookmarkStore } from "../types/store";

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  folders: [],
  tags: [],
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
  setIsRenameDialogOpen: (isOpen) => set({ isRenameDialogOpen: isOpen }),
  setIsDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),

  setEditingName: (name) => set({ editingName: name }),
  // API actions

  renameFolder: async (id, newName) => {
    try {
      // Make an API call to update the folder in the database
      const response = await axiosClient.put(`/api/folders/${id}`, {
        name: newName,
      });

      if (response.status >= 200 && response.status <= 300) {
        // If the API call is successful, update the state
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name: newName } : folder
          ),
          selectedContent:
            state.selectedContent ===
            state.folders.find((f) => f.id === id)?.name
              ? newName
              : state.selectedContent,
        }));
      } else {
        throw new Error("Failed to update folder name in the database");
      }
    } catch (error) {
      console.error("Error updating folder name", error);
    }
  },

  fetchFolders: async () => {
    try {
      const response = await axiosClient.get("/api/folders");

      if (response.status >= 200 && response.status <= 300) {
        const folderList = response.data; // Ensure folderList is an array

        set(() => ({
          folders: folderList, // Replace the old state with the fetched data
        }));
      } else {
        throw new Error("Failed to fetch folders");
      }
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  },

  fetchTags: async () => {
    try {
      const response = await axiosClient.get("/api/tags");

      if (response.status >= 200 && response.status <= 300) {
        const tagList = response.data;

        set(() => ({
          tags: tagList,
        }));
      } else {
        throw new Error("Failed to fetch tags");
      }
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  },

  addFolder: async (name) => {
    try {
      const response = await axiosClient.post("/api/folders", { name });
      if (response.status >= 200 && response.status < 300) {
        const newFolder = response.data[0]; // Assuming the backend returns the full folder object

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
      } else {
        throw new Error("Failed to add folder");
      }
    } catch (error) {
      console.error("Error adding folder: ", error);
    }
  },

  deleteFolder: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/folders/${id}`);
      if (response.status >= 200 && response.status < 300) {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          bookmarks: state.bookmarks.filter(
            (bookmark) => bookmark.folderId !== id
          ),
          selectedContent: "All Bookmarks",
        }));
      } else {
        throw new Error("Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder: ", error);
    }
  },

  toggleFolderCollapse: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? { ...folder, isCollapsed: !folder.isCollapsed }
          : folder
      ),
    })),

  addTag: async (name) => {
    try {
      const response = await axiosClient.post("/api/tags", { name });
      if (response.status >= 200 && response.status < 300) {
        const newTag = response.data[0]; // Assuming the backend returns the full tag object
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      } else {
        throw new Error("Failed to add tag");
      }
    } catch (error) {
      console.error("Error adding tag: ", error);
    }
  },

  renameTag: async (id, newName) => {
    try {
      // Make an API call to update the tag in the database
      const response = await axiosClient.put(`/api/tags/${id}`, {
        name: newName,
      });

      if (response.status >= 200 && response.status <= 300) {
        // If the API call is successful, update the state
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, name: newName } : tag
          ),
          selectedContent:
            state.selectedContent === state.tags.find((t) => t.id === id)?.name
              ? newName
              : state.selectedContent,
        }));
      } else {
        throw new Error("Failed to update tag name in the database");
      }
    } catch (error) {
      console.error("Error updating tag name", error);
    }
  },

  deleteTag: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/tags/${id}`);
      if (response.status >= 200 && response.status < 300) {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          bookmarks: state.bookmarks.filter(
            (bookmark) => !bookmark.tags.includes(id)
          ),
          selectedContent: "All Bookmarks",
        }));
      } else {
        throw new Error("Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag: ", error);
    }
  },

  fetchBookmark: async () => {
    try {
      const response = await axiosClient.get("/api/bookmarks");

      if (response.status >= 200 && response.status <= 300) {
        const bookmarkList = response.data; // Ensure folderList is an array
        console.log(bookmarkList);
        
        set(() => ({
          bookmarks: bookmarkList, // Replace the old state with the fetched data
        }));
      } else {
        throw new Error("Failed to fetch bookmarks");
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
    }
  },

  addBookmark: async (bookmark) => {
    try {
      const response = await axiosClient.post("/api/bookmarks", bookmark);
      if (response.status >= 200 && response.status < 300) {
        const newBookmark = response.data; // Backend should return the created bookmark
        set((state) => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }));
      } else {
        throw new Error("Failed to add bookmark");
      }
    } catch (error) {
      console.error("Error adding bookmark: ", error);
    }
  },

  editBookmark: async (id, updatedBookmark) => {
    try {
      const response = await axiosClient.put(
        `/api/bookmarks/${id}`,
        updatedBookmark
      );
      if (response.status >= 200 && response.status < 300) {
        const updatedData = response.data; // Assuming the backend returns the updated bookmark
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark.id === id ? { ...bookmark, ...updatedData } : bookmark
          ),
        }));
      } else {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error updating bookmark: ", error);
    }
  },

  deleteBookmark: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/bookmarks/${id}`);
      if (response.status >= 200 && response.status < 300) {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        }));
      } else {
        throw new Error("Failed to delete bookmark");
      }
    } catch (error) {
      console.error("Error deleting bookmark: ", error);
    }
  },

  setSelectedContent: (content) => set({ selectedContent: content }),

  setIsAddBookmarkModalOpen: (isOpen) =>
    set({ isAddBookmarkModalOpen: isOpen }),

  setEditingBookmark: (bookmark) => set({ editingBookmark: bookmark }),
}));
