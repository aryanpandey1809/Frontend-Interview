import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface BlogDetailProps {
  blogId: string;
}

export function BlogDetail({ blogId }: BlogDetailProps) {
  const { data: blog, isLoading, isError, error } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getBlogById(blogId),
    enabled: !!blogId,
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-300 bg-red-50 h-full">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Blog</CardTitle>
          <CardDescription className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to fetch blog details'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!blog) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-gray-500 text-center">Select a blog to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.category.map((cat) => (
            <Badge key={cat} variant="default">
              {cat}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-3xl mb-2">{blog.title}</CardTitle>
        <CardDescription className="text-base">
          {new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-lg mb-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="prose max-w-none">
          <p className="text-lg font-medium text-gray-800 mb-4">{blog.description}</p>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
