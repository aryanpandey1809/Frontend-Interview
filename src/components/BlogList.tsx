import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import type { Blog } from '../types/blog';

interface BlogListProps {
  onSelectBlog: (blog: Blog) => void;
  selectedBlogId?: string;
}

export function BlogList({ onSelectBlog, selectedBlogId }: BlogListProps) {
  const { data: blogs, isLoading, isError, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getAllBlogs,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="cursor-pointer">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Blogs</CardTitle>
          <CardDescription className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to fetch blogs'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Blogs Found</CardTitle>
          <CardDescription>Start by creating your first blog post!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedBlogId === blog.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onSelectBlog(blog)}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {blog.category.map((cat) => (
                <Badge key={cat} variant="default">
                  {cat}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-xl">{blog.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 line-clamp-2">{blog.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
