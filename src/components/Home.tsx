import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DarkModeToggle } from './ui/dark-mode-toggle';
import { MobileNav } from './ui/mobile-nav';

export function Home() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeString);
    };

    // Update time immediately
    updateTime();

    // Set up interval to update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Simple Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white dark:border-gray-800/60 dark:bg-gray-950">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Kevin Tong
            </Link>
          </div>
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              to="/portfolio"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Portfolio
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/weather"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Weather
            </Link>
            <Link
              to="/events"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Events
            </Link>
            <a
              href="#projects"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Projects
            </a>
            <DarkModeToggle />
          </div>
          <div className="flex items-center space-x-2 md:hidden">
            <DarkModeToggle />
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Hello!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Welcome to my site!</p>
          </div>

          {/* Navigation Cards */}
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
            <Link to="/portfolio">
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    💼 Portfolio
                  </CardTitle>
                  <CardDescription className="mt-3 text-left">
                    Professional showcase of my skills and projects
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/dashboard">
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    📊 Dashboard
                  </CardTitle>
                  <CardDescription className="mt-3 text-left">
                    My personal dashboard with various widgets and tools
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Time Display */}
          <div className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{currentTime}</p>
          </div>
        </div>

        {/* Projects Section */}
        <section id="projects" className="mt-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Things I've Built
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Personal Dashboard</CardTitle>
                <CardDescription className="mt-3 text-left">
                  A customizable dashboard with various widgets and utilities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-center">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      View Live
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Weather App</CardTitle>
                <CardDescription className="mt-3 text-left">
                  Real-time weather data with forecasts and detailed metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-center">
                  <Link to="/weather">
                    <Button variant="outline" size="sm">
                      View Live
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">EDM Events Finder</CardTitle>
                <CardDescription className="mt-3 text-left">
                  Discover electronic music events and track your favorites
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-center">
                  <Link to="/events">
                    <Button variant="outline" size="sm">
                      View Live
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">More Coming Soon...</CardTitle>
                <CardDescription className="mt-3 text-left">
                  Always working on something new. Check back later!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" disabled>
                    In Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
