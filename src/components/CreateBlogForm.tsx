import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import type { CreateBlogInput } from '../types/blog';

interface CreateBlogFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateBlogForm({ onClose, onSuccess }: CreateBlogFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateBlogInput>({
    title: '',
    category: [],
    description: '',
    coverImage: '',
    content: '',
  });
  const [categoryInput, setCategoryInput] = useState('');

  const createMutation = useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setFormData({
        title: '',
        category: [],
        description: '',
        coverImage: '',
        content: '',
      });
      onSuccess?.();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.category.includes(categoryInput.trim().toUpperCase())) {
      setFormData({
        ...formData,
        category: [...formData.category, categoryInput.trim().toUpperCase()],
      });
      setCategoryInput('');
    }
  };

  const removeCategory = (cat: string) => {
    setFormData({
      ...formData,
      category: formData.category.filter((c) => c !== cat),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Create New Blog</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add category (press Enter)"
              />
              <Button type="button" onClick={addCategory} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.category.map((cat) => (
                <div
                  key={cat}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your blog"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <Input
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your blog content here..."
              rows={10}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? 'Creating...' : 'Create Blog'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-300 rounded-md p-3 text-red-700 text-sm">
              Error: {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create blog'}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
