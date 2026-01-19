import { useState } from 'react'
import { BlogList } from './components/BlogList'
import { BlogDetail } from './components/BlogDetail'
import { CreateBlogForm } from './components/CreateBlogForm'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import type { Blog } from './types/blog'
import './App.css'

function App() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">CA Monk Blog</h1>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Blog
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Blog List */}
          <div className="lg:h-[calc(100vh-180px)] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Blogs</h2>
            <BlogList 
              onSelectBlog={(blog) => {
                setSelectedBlog(blog)
                setShowCreateForm(false)
              }} 
              selectedBlogId={selectedBlog?.id}
            />
          </div>

          {/* Right Panel - Blog Detail or Create Form */}
          <div className="lg:h-[calc(100vh-180px)] overflow-hidden">
            {showCreateForm ? (
              <CreateBlogForm 
                onClose={() => setShowCreateForm(false)}
                onSuccess={() => setShowCreateForm(false)}
              />
            ) : selectedBlog ? (
              <BlogDetail blogId={selectedBlog.id} />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg border border-gray-200">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">Select a blog to read</p>
                  <p className="text-sm">or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
