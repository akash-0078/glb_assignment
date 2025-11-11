// components/AIChat/AIChat.js
'use client';
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  BookOpen,
  Sparkles,
  Zap,
  X
} from "lucide-react";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: "m1", 
      sender: "agent", 
      text: "Hi! I'm the support agent. Ask me anything about the blogging platform.", 
      timestamp: new Date() 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function append(msg) {
    const newMessage = { ...msg, timestamp: new Date() };
    setMessages((m) => [...m, newMessage]);
  }

  async function send() {
    if (!input.trim()) return;
    const question = input.trim();
    
    // Add user message
    append({ id: `u-${Date.now()}`, sender: "user", text: question });
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json?.answer || "Server error");
      }
      
      append({ id: `a-${Date.now()}`, sender: "agent", text: json.answer });
    } catch (err) {
      setError(err.message || "Network error");
      append({ 
        id: `a-${Date.now()}`, 
        sender: "agent", 
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment." 
      });
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const quickQuestions = [
    "How do I create a blog post?",
    "How to reset my password?",
    "What are the formatting options?",
    "How to delete my account?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Card */}
          <Card className="w-full max-w-2xl mx-4 my-4 shadow-2xl border-0 pointer-events-auto relative mr-20 ">
            <CardHeader className="pb-4  text-black rounded-t-lg ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-black flex items-center gap-2">
                      Support Agent
                      <Badge variant="secondary" className="bg-white/20 text-black border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                    </CardTitle>
                    <p className="text-blue-400 text-sm">Ask me anything about the platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-black hover:bg-white/20"
                    asChild
                  >
                    <a href="/kb">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Knowledge Base
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black hover:bg-black/20 w-8 h-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Chat Messages */}
              <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className={`w-8 h-8 ${
                        message.sender === "user" 
                          ? "bg-blue-600" 
                          : "bg-purple-600"
                      }`}>
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          {message.sender === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[80%] ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}>
                        <div className={`inline-block rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none border"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 bg-purple-600">
                        <AvatarFallback className="bg-transparent text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 border">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 rounded-full"
                        onClick={() => setInput(question)}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="px-4 pb-3">
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question about the platform..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                    className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                    size="icon"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}