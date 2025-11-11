// src/store/useStore.js
import {create} from "zustand";

export const useStore = create((set) => ({
  user: null,          // { id, email }
  token: null,         // JWT
  blogs: [],
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
  setBlogs: (blogs) => set({ blogs }),
  addBlog: (blog) => set((s) => ({ blogs: [blog, ...s.blogs] })),
}));
