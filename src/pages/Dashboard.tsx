import { BookmarksWidget } from '../components/dashboard/BookmarksWidget';
import { ClockWidget } from '../components/dashboard/ClockWidget';
import { QuoteWidget } from '../components/dashboard/QuoteWidget';
import { TodoWidget } from '../components/dashboard/TodoWidget';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { Button } from '../components/ui/button';
import { DarkModeToggle } from '../components/ui/dark-mode-toggle';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/95">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex flex-1 items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <span className="hidden sm:inline">← Back</span>
              <span className="sm:hidden">←</span>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Personal Dashboard
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, Kevin!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's your personal dashboard to stay organized and inspired.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Clock & Date - Takes up 2 columns on larger screens */}
          <div className="lg:col-span-2">
            <ClockWidget />
          </div>

          {/* Weather Widget */}
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>

          {/* Quote Widget */}
          <div className="lg:col-span-1">
            <QuoteWidget />
          </div>

          {/* Todo List - Takes up 2 columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <TodoWidget />
          </div>

          {/* Bookmarks - Takes up 2 columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <BookmarksWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
