"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ui/image-upload";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  image: string;
  imageAlt?: string;
  slug: string;
  status: "published" | "draft";
  isActive: boolean;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoOgImage?: string;
  seoTwitterTitle?: string;
  seoTwitterDescription?: string;
  seoTwitterImage?: string;
  seoCanonicalUrl?: string;
  seoRobotsIndex?: boolean;
  seoRobotsFollow?: boolean;
  seoAuthor?: string;
  seoPublisher?: string;
  seoArticleSection?: string;
  seoArticleTags?: string[];
  // Backend fields
  isPublished?: boolean;
  isFeatured?: boolean;
}

interface AdminBlogsProps {
  initialAction?: string | null;
  onActionComplete?: () => void;
}

const AdminBlogs = ({ initialAction, onActionComplete }: AdminBlogsProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "all">("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; blogId: string | null; blogTitle: string }>({
    isOpen: false,
    blogId: null,
    blogTitle: ""
  });

  // Handle initial action from sidebar
  useEffect(() => {
    if (initialAction === 'create') {
      setActiveTab("create");
      setEditing(null);
      onActionComplete?.();
    }
  }, [initialAction, onActionComplete]);

  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    status: "draft",
    readTime: "",
    image: "",
    imageAlt: "",
    slug: "",
    publishDate: "",
    isActive: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    seoOgTitle: "",
    seoOgDescription: "",
    seoOgImage: "",
    seoTwitterTitle: "",
    seoTwitterDescription: "",
    seoTwitterImage: "",
    seoCanonicalUrl: "",
    seoRobotsIndex: true,
    seoRobotsFollow: true,
    seoAuthor: "",
    seoPublisher: "Paradise Yatra",
    seoArticleSection: "",
    seoArticleTags: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      const data = await response.json();
      
      if (response.ok) {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          console.error('Unexpected data structure:', data);
          setBlogs([]);
        }
      } else {
        console.error('Failed to fetch blogs:', data.message);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/blogs/${editing}` : '/api/blogs';
      
      // Get the admin token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Please log in to save changes');
        return;
      }
      
      // Transform formData to match backend expectations
      const backendData = {
        ...formData,
        isPublished: formData.status === 'published',
        isFeatured: formData.status === 'published', // Auto-mark published blogs as featured
        readTime: parseInt(formData.readTime) || 5,
        // Remove frontend-specific fields
        status: undefined,
        publishDate: undefined,
        isActive: undefined
      };

      // Check if we need to upload a file
      const hasFileUpload = formData.image && (formData.image.startsWith('blob:') || formData.image.startsWith('data:'));
      
      let response;
      if (hasFileUpload) {
        // Handle file upload
        const uploadFormData = new FormData();
        
        // Add all form fields
        Object.keys(backendData).forEach(key => {
          const value = (backendData as Record<string, unknown>)[key];
          if (key === 'image' && typeof value === 'string' && value.startsWith('blob:')) {
            // Convert blob URL to file and upload
            fetch(value)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            // Convert data URL to file and upload
            const response = fetch(value);
            response.then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                uploadFormData.append('image', file);
              });
          } else if (value !== undefined) {
            uploadFormData.append(key, String(value));
          }
        });

        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });
      } else {
        // Handle regular JSON data
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(backendData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        await fetchBlogs();
        setEditing(null);
        setActiveTab("all");
        resetForm();
        toast.success(editing ? 'Blog updated successfully!' : 'Blog added successfully!');
      } else {
        console.error('Failed to save blog:', data.message);
        toast.error(`Failed to save: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditing(blog._id || '');
    // Transform backend data to frontend format
    const status = blog.isPublished ? 'published' : 'draft';
    const frontendData: BlogPost = {
      ...blog,
      status,
      readTime: blog.readTime?.toString() || '5',
      publishDate: blog.publishDate || '',
      isActive: blog.isActive !== undefined ? blog.isActive : true
    };
    setFormData(frontendData);
    setActiveTab("create");
  };

  const handleDelete = async (id: string) => {
    // Find the blog to get its title for the confirmation dialog
    const blog = blogs.find(b => b._id === id || b.id === id);
    if (blog) {
      setDeleteDialog({
        isOpen: true,
        blogId: id,
        blogTitle: blog.title
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.blogId) return;
    
    try {
      // Get the admin token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Please log in to delete blogs');
        return;
      }
      
      const response = await fetch(`/api/blogs/${deleteDialog.blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchBlogs();
        toast.success('Blog deleted successfully!');
      } else {
        console.error('Failed to delete blog:', data.message);
        toast.error(`Failed to delete: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setActiveTab("all");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      status: "draft",
      readTime: "",
      image: "📝",
      imageAlt: "",
      slug: "",
      publishDate: "",
      isActive: true,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      seoOgTitle: "",
      seoOgDescription: "",
      seoOgImage: "",
      seoTwitterTitle: "",
      seoTwitterDescription: "",
      seoTwitterImage: "",
      seoCanonicalUrl: "",
      seoRobotsIndex: true,
      seoRobotsFollow: true,
      seoAuthor: "",
      seoPublisher: "Paradise Yatra",
      seoArticleSection: "",
      seoArticleTags: []
    });
  };

  const handleAddNew = () => {
    setEditing(null);
    setActiveTab("create");
    resetForm();
  };

  const handleShowAllBlogs = () => {
    setActiveTab("all");
    setEditing(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-700">
            {activeTab === "all" 
              ? `Manage blog posts and articles (${Array.isArray(blogs) ? blogs.length : 0} blogs)` 
              : editing 
                ? "Edit blog post" 
                : "Create new blog post"
            }
          </p>
        </div>
        <Button 
          onClick={() => {
            setActiveTab("create");
            setEditing(null);
            resetForm();
          }} 
          variant="admin-primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Blog
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={handleShowAllBlogs}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Blogs ({Array.isArray(blogs) ? blogs.length : 0})
        </button>
        <button
          onClick={handleAddNew}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "create"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {editing ? 'Edit Blog' : 'Create Blog'}
        </button>
      </div>

      {activeTab === "create" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">{editing ? 'Edit Blog Post' : 'Add New Blog Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Blog post title"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Travel Guide"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <Input
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="5 min read"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "published" | "draft" }))}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the blog post..."
                rows={3}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="blog-post-slug"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                  label="Blog Image"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <Input
                value={formData.imageAlt || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                placeholder="Describe the image for accessibility and SEO (e.g., 'Mountain landscape with snow peaks')"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Important for accessibility and SEO. Describe what the image shows.
              </p>
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Meta Tags</h3>
              
              <div className="space-y-6">
                {/* Basic SEO */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Basic SEO</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <Input
                    value={formData.seoTitle || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="SEO optimized title (optional)"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                        Leave empty to use the main title. Recommended: 50-60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <Textarea
                    value={formData.seoDescription || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Brief description for search engines (150-160 characters recommended)"
                    rows={3}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription ? `${formData.seoDescription.length}/160 characters` : "0/160 characters"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <Input
                    value={formData.seoKeywords?.join(', ') || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                    }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Canonical URL
                      </label>
                      <Input
                        value={formData.seoCanonicalUrl || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoCanonicalUrl: e.target.value }))}
                        placeholder="https://yourdomain.com/blog/post-slug"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Graph */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-800 mb-3">Open Graph (Facebook/LinkedIn)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Title
                      </label>
                      <Input
                        value={formData.seoOgTitle || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoOgTitle: e.target.value }))}
                        placeholder="Open Graph title (optional)"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Description
                      </label>
                      <Textarea
                        value={formData.seoOgDescription || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoOgDescription: e.target.value }))}
                        placeholder="Open Graph description (optional)"
                        rows={2}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Image
                      </label>
                      <ImageUpload
                        value={formData.seoOgImage || ""}
                        onChange={(value) => setFormData(prev => ({ ...prev, seoOgImage: value }))}
                        label=""
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 1200x630 pixels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Twitter Cards */}
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-sky-800 mb-3">Twitter Cards</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Title
                      </label>
                      <Input
                        value={formData.seoTwitterTitle || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTwitterTitle: e.target.value }))}
                        placeholder="Twitter title (optional)"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Description
                      </label>
                      <Textarea
                        value={formData.seoTwitterDescription || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTwitterDescription: e.target.value }))}
                        placeholder="Twitter description (optional)"
                        rows={2}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Image
                      </label>
                      <ImageUpload
                        value={formData.seoTwitterImage || ""}
                        onChange={(value) => setFormData(prev => ({ ...prev, seoTwitterImage: value }))}
                        label=""
                      />
                  <p className="text-xs text-gray-500 mt-1">
                        Recommended: 1200x675 pixels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article Schema */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-green-800 mb-3">Article Schema</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <Input
                        value={formData.seoAuthor || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoAuthor: e.target.value }))}
                        placeholder="Article author name"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publisher
                      </label>
                      <Input
                        value={formData.seoPublisher || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoPublisher: e.target.value }))}
                        placeholder="Publisher name"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article Section
                      </label>
                      <Input
                        value={formData.seoArticleSection || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoArticleSection: e.target.value }))}
                        placeholder="e.g., Travel, Adventure, Culture"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article Tags
                      </label>
                      <Input
                        value={formData.seoArticleTags?.join(', ') || ""}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          seoArticleTags: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                        }))}
                        placeholder="tag1, tag2, tag3"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Robots */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-yellow-800 mb-3">Search Engine Indexing</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.seoRobotsIndex || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoRobotsIndex: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Allow indexing</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.seoRobotsFollow || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoRobotsFollow: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Allow following links</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleCancel}
                variant="admin-outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="admin-primary"
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editing ? 'Update Blog' : 'Create Blog'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "all" && (
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blogs found. Create your first blog post!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <Card key={blog._id || blog.id} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                        <Badge 
                          variant={blog.status === 'published' ? 'default' : 'secondary'}
                          className={blog.status === 'published' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}
                        >
                          {blog.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <span>{blog.category}</span>
                        <span>•</span>
                        <span>{blog.readTime} min read</span>
                        {blog.publishDate && (
                          <>
                            <span>•</span>
                            <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(blog)}
                        variant="admin-primary"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog._id || blog.id || '')}
                        variant="admin-secondary"
                        size="sm"
                        className="flex items-center gap-1 bg-red-600 text-white hover:cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" })}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteDialog.blogTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminBlogs; 