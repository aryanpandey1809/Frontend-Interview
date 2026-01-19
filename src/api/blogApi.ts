import axios from 'axios';
import type { Blog, CreateBlogInput } from '../types/blog';

const API_BASE_URL = 'http://127.0.0.1:3001';

export const blogApi = {
  // Get all blogs
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await axios.get(`${API_BASE_URL}/blogs`);
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<Blog> => {
    const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
    return response.data;
  },

  // Create a new blog
  createBlog: async (blog: CreateBlogInput): Promise<Blog> => {
    const newBlog = {
      ...blog,
      date: new Date().toISOString(),
    };
    const response = await axios.post(`${API_BASE_URL}/blogs`, newBlog);
    return response.data;
  },
};
