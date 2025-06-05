import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { DarkModeToggle } from '../components/ui/dark-mode-toggle';
import { LocationSelector } from '../components/edm-events/LocationSelector';
import { edmtrainService } from '../lib/edmtrain/edmtrainService';
import type { EdmtrainEvent, EdmtrainLocation } from '../lib/edmtrain/types';

export function EdmEvents() {
  const [events, setEvents] = useState<EdmtrainEvent[]>([]);
  const [categorizedEvents, setCategorizedEvents] = useState<Record<string, EdmtrainEvent[]>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<EdmtrainLocation | 'current' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      fetchEvents();
    }
  }, [selectedLocation]);

  const fetchEvents = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);
      setError(null);

      let eventsData: EdmtrainEvent[] = [];

      if (selectedLocation === 'current') {
        eventsData = await edmtrainService.getCurrentLocationEvents();
      } else {
        eventsData = await edmtrainService.getEventsByCity(selectedLocation.city, selectedLocation.state);
      }

      setEvents(eventsData);

      // Categorize events by genre
      const categorized = edmtrainService.categorizeEventsByGenre(eventsData);
      setCategorizedEvents(categorized);

      // Reset genre filter to 'All' when new location is selected
      setSelectedGenre('All');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      setEvents([]);
      setCategorizedEvents({});
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: EdmtrainLocation | 'current' | null) => {
    setSelectedLocation(location);
    if (!location) {
      setEvents([]);
      setCategorizedEvents({});
      setSelectedGenre('All');
    }
  };

  const handleRefresh = () => {
    edmtrainService.clearCache();
    fetchEvents();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Time TBA';

    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const getEventDisplayName = (event: EdmtrainEvent) => {
    if (event.name) {
      return event.name;
    }

    if (event.artists.length > 0) {
      const artistNames = event.artists.map(artist => artist.name);
      if (artistNames.length === 1) {
        return artistNames[0];
      } else if (artistNames.length === 2) {
        return artistNames.join(' & ');
      } else {
        return `${artistNames[0]} + ${artistNames.length - 1} more`;
      }
    }

    return 'EDM Event';
  };

  const getEventArtists = (event: EdmtrainEvent) => {
    if (event.artists.length === 0) return 'Artists TBA';

    return event.artists.map(artist => artist.name).join(', ');
  };

  const getGenres = () => {
    return Object.keys(categorizedEvents).filter(genre =>
      categorizedEvents[genre].length > 0
    );
  };

  const getFilteredEvents = () => {
    if (selectedGenre === 'All' || !categorizedEvents[selectedGenre]) {
      return events;
    }
    return categorizedEvents[selectedGenre];
  };

  const getTicketUrl = (event: EdmtrainEvent) => {
    if (event.ticketLinks && event.ticketLinks.length > 0) {
      return event.ticketLinks[0].url;
    }
    return event.link; // Fallback to event link
  };

  const availableGenres = getGenres();
  const filteredEvents = getFilteredEvents();

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
              EDM Events
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            {selectedLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="text-xs"
              >
                🔄 Refresh
              </Button>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Upcoming EDM Events 🎵
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover the hottest electronic dance music events powered by Edmtrain
          </p>
        </div>

        {/* Location Selector */}
        <LocationSelector
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          loading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedLocation === 'current'
                  ? 'Getting your location and loading events...'
                  : 'Loading events...'
                }
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-red-100 p-6 dark:bg-red-900/30">
              <div className="h-full w-full rounded-full bg-red-300 dark:bg-red-600 flex items-center justify-center">
                <span className="text-red-600 dark:text-red-300 text-2xl">⚠️</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {error}
            </p>
            <div className="space-x-2">
              <Button onClick={handleRefresh} disabled={loading}>
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedLocation(null)}
              >
                Change Location
              </Button>
            </div>
          </div>
        )}

        {/* No Location Selected */}
        {!selectedLocation && !loading && !error && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-blue-100 p-6 dark:bg-blue-900/30">
              <div className="h-full w-full rounded-full bg-blue-300 dark:bg-blue-600 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-2xl">📍</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Select a location to get started
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose your current location or search for events in a specific city
            </p>
          </div>
        )}

        {/* Events Content */}
        {selectedLocation && !loading && !error && (
          <>
            {/* Genre Filter */}
            {availableGenres.length > 1 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedGenre === genre
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {genre} ({categorizedEvents[genre]?.length || 0})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                  <div
                    key={event.id}
                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Event Header */}
                    <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-6 text-white">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                            {event.festivalInd ? 'Festival' : 'Show'}
                          </span>
                          {event.ages && (
                            <span className="inline-block rounded-full bg-white/20 px-2 py-1 text-xs">
                              {event.ages}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold leading-tight mb-1">
                            {getEventDisplayName(event)}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {getEventArtists(event)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>📍 {event.venue.name}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>📅 {formatDate(event.date)}</span>
                          <span>🕒 {formatTime(event.startTime)}</span>
                        </div>

                        {event.venue.address && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {event.venue.address}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={getTicketUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                            Get Tickets
                          </button>
                        </a>

                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                            Details
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Events Message */
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                  <div className="h-full w-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-400 text-2xl">🎵</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedGenre === 'All'
                    ? `No upcoming EDM events found for ${selectedLocation === 'current' ? 'your location' : 'this location'}.`
                    : `No ${selectedGenre} events found. Try selecting a different genre.`
                  }
                </p>
                <div className="space-x-2">
                  {selectedGenre !== 'All' && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedGenre('All')}
                    >
                      Show All Events
                    </Button>
                  )}
                  <Button onClick={handleRefresh}>
                    Refresh Events
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* API Attribution */}
        {events.length > 0 && (
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Event data provided by{' '}
              <a
                href="https://edmtrain.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edmtrain
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
