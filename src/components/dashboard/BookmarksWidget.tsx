import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: Date;
}

const defaultBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    favicon: 'https://github.com/favicon.ico',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    favicon: 'https://stackoverflow.com/favicon.ico',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    favicon: 'https://developer.mozilla.org/favicon.ico',
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'React Documentation',
    url: 'https://react.dev',
    favicon: 'https://react.dev/favicon.ico',
    createdAt: new Date(),
  },
];

export function BookmarksWidget() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '' });

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('dashboard-bookmarks');
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks).map((bookmark: any) => ({
          ...bookmark,
          createdAt: new Date(bookmark.createdAt),
        }));
        setBookmarks(parsedBookmarks);
      } catch {
        // Error loading bookmarks
      }
    } else {
      setBookmarks(defaultBookmarks);
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem('dashboard-bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const addBookmark = () => {
    if (newBookmark.title.trim() && newBookmark.url.trim()) {
      let url = newBookmark.url.trim();
      // Add https:// if no protocol is specified
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const bookmark: Bookmark = {
        id: Date.now().toString(),
        title: newBookmark.title.trim(),
        url: url,
        favicon: `${new URL(url).origin}/favicon.ico`,
        createdAt: new Date(),
      };

      setBookmarks([bookmark, ...bookmarks]);
      setNewBookmark({ title: '', url: '' });
      setShowAddForm(false);
    }
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addBookmark();
    } else if (e.key === 'Escape') {
      setShowAddForm(false);
      setNewBookmark({ title: '', url: '' });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Bookmarks
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add bookmark form */}
        {showAddForm && (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <input
              type="text"
              value={newBookmark.title}
              onChange={e => setNewBookmark({ ...newBookmark, title: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Bookmark title..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              value={newBookmark.url}
              onChange={e => setNewBookmark({ ...newBookmark, url: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="URL (e.g., example.com)..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-2">
              <Button onClick={addBookmark} size="sm" className="flex-1">
                Add Bookmark
              </Button>
            </div>
          </div>
        )}

        {/* Bookmarks list */}
        <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto">
          {bookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="h-4 w-4 flex-shrink-0"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {bookmark.title}
                  </h3>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {getDomainFromUrl(bookmark.url)}
                </p>
              </a>
              <button
                onClick={e => {
                  e.preventDefault();
                  deleteBookmark(bookmark.id);
                }}
                className="absolute top-2 right-2 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {bookmarks.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>No bookmarks yet. Add your favorite links!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
