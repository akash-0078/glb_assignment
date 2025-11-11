'use client';
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AIChat from "@/components/AIChat";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, LogOut, User, Calendar, BookOpen, Edit3 } from "lucide-react";

export default function Home() {
  const { get, post, loading, error } = useApi();
  const { blogs, user, clearUser, setBlogs } = useStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false);

  useEffect(() => {
    async function load() {
      setLoadingFetch(true);
      const data = await get("/api/blogs", { update: "setBlogs" });
      setLoadingFetch(false);
    }
    load();
  }, []); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    const data = await post("/api/blogs", { title, content }, { update: "addBlog" });
    if (data?.blog) {
      setTitle(""); 
      setContent("");
    }
  };

  const logout = () => {
    clearUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getUserInitials = (email) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mini Blog</h1>
                  <p className="text-gray-600 text-sm">Share your thoughts with the world</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 hidden sm:block">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/signup">
                        <Plus className="w-4 h-4 mr-2" />
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Blog Form */}
            {user && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    Create New Blog Post
                  </CardTitle>
                  <CardDescription>
                    Share your thoughts and ideas with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter blog title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="h-12 text-lg font-medium"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your blog content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="min-h-[120px] resize-none"
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Publish Blog
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Blog List */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  All Blog Posts
                  <Badge variant="secondary" className="ml-2">
                    {blogs.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingFetch ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading blogs...</span>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to share your thoughts!</p>
                    {!user && (
                      <Button asChild>
                        <Link href="/signup">
                          Get Started
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {blogs.map((blog) => (
                      <Card key={blog.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                              {blog.title}
                            </h3>
                            {/* <Badge variant="outline" className="ml-2 flex-shrink-0">
                              {blog.category || "General"}
                            </Badge> */}
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {blog.content}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                    {getUserInitials(blog.author?.email || "U")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{blog.author?.email || "Unknown"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {/* <Button variant="ghost" size="sm" asChild>
                              <Link href={`/blogs/${blog.id}`}>
                                Read More
                              </Link>
                            </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Blog Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Posts</span>
                  <Badge variant="default">{blogs.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your Posts</span>
                  <Badge variant="outline">
                    {user ? blogs.filter(b => b.author?.email === user.email).length : 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {user && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setTitle("");
                      setContent("");
                      document.querySelector('input')?.focus();
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Your Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Welcome Card */}
            {!user && (
              <Card className="shadow-lg border-0 bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900">Join Our Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-800 text-sm">
                    Sign up to start writing your own blog posts and engage with the community.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link href="/signup">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Account
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-blue-300">
                      <Link href="/login">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <AIChat />
    </div>
  );
}