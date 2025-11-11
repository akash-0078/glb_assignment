// hooks/useApi.js
import { useState } from "react";
import { useStore } from "@/store/useStore";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setBlogs, addBlog, token } = useStore();

  const apiBase = ""; // same origin; change if needed

  const call = async ({ path, method = "GET", body = null, update = null }) => {
    setLoading(true);
    setError(null);

    try {
      const opts = {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      };
      // attach JWT if present
      const storedToken = token || (typeof window !== "undefined" && localStorage.getItem("token"));
      if (storedToken) opts.headers["Authorization"] = `Bearer ${storedToken}`;

      const res = await fetch(`${apiBase}${path}`, opts);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "API Error");
      }

      // update Zustand store when requested
      if (update === "setBlogs" && data.blogs) {
        setBlogs(data.blogs);
      } else if (update === "addBlog" && data.blog) {
        addBlog(data.blog);
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Unknown error");
      setLoading(false);
      return null;
    }
  };

  const get = (path, options = {}) => call({ path, method: "GET", ...options });
  const post = (path, body, options = {}) => call({ path, method: "POST", body, ...options });

  return { get, post, loading, error, setError };
}

