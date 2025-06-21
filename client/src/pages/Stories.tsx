import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface Story {
  id: string;
  content: string;
  category: string;
  supportCount: number;
  createdAt: string;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStory, setNewStory] = useState({
    content: '',
    category: 'general'
  });

  const auth = getAuth();
  const user = auth.currentUser;

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'healing', label: 'Healing Journey' },
    { value: 'safety', label: 'Safety Planning' },
    { value: 'support', label: 'Support & Encouragement' }
  ];

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const addStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStory)
      });

      if (!response.ok) throw new Error('Failed to create story');

      // Reset form and refresh stories
      setNewStory({ content: '', category: 'general' });
      setShowAddForm(false);
      fetchStories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story');
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Stories</h1>
          <p className="text-gray-600 mb-6">
            Read and share healing stories from others who have walked similar paths. 
            Your story matters and can help others find hope and strength.
          </p>
          
          {/* Add Story Button */}
          {user && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : 'Share Your Story'}
            </button>
          )}
        </div>

        {/* Add Story Form */}
        {showAddForm && user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Share Your Story</h3>
            <form onSubmit={addStory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory({...newStory, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Story
                </label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                  rows={6}
                  placeholder="Share your healing journey, what helped you, or words of encouragement for others..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Share Story
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stories List */}
        <div className="space-y-6">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No stories yet. Be the first to share!</p>
            </div>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {story.category.replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>❤️ {story.supportCount}</span>
                    <span>•</span>
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  "{story.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Show Support ❤️
                  </button>
                  <span className="text-xs text-gray-400">
                    Anonymous survivor
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 