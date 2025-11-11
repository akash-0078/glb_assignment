// src/app/(pages)/kb/page.jsx
import fs from "fs";
import path from "path";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Filter, ArrowRight, Tag } from "lucide-react";

export const metadata = {
  title: "Knowledge Base",
};

export default async function KBPage() {
  const kbPath = path.resolve(process.cwd(), "public/kb.json");
  const kbData = JSON.parse(fs.readFileSync(kbPath, "utf-8"));

  // Extract all unique categories for filtering
  const categories = [...new Set(kbData.flatMap(entry => entry.categories || []))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Base
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of our platform
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search knowledge base..."
                  className="pl-10 h-12 text-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                  Search
                </Button>
              </div>
            </div>
            
            {/* Categories */}
            {categories.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{kbData.length}</div>
              <div className="text-gray-600">Articles</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Base Articles */}
        <div className="grid gap-6">
          {kbData.map((entry) => (
            <Card 
              key={entry.id} 
              className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:border-blue-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {entry.title}
                    </CardTitle>
                    {entry.description && (
                      <CardDescription className="text-gray-600 mt-2 text-base">
                        {entry.description}
                      </CardDescription>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {entry.content}
                </p>
                
                {/* Categories */}
                {entry.categories && entry.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.categories.map((category, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs text-blue-600 border-blue-200"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Last Updated */}
                {entry.lastUpdated && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Last updated: {new Date(entry.lastUpdated).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                size="lg"
              >
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-gray-500 hover:bg-white hover:text-blue-600 font-semibold"
                size="lg"
              >
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}