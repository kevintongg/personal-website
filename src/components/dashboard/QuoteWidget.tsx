import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Quote {
  text: string;
  author: string;
}

const fallbackQuotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  }
];

export function QuoteWidget() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const getRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // Try to fetch from quotable API
      const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=150');
      if (response.ok) {
        const data = await response.json();
        setQuote({
          text: data.content,
          author: data.author
        });
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      // Fallback to local quotes if API fails
      setQuote(getRandomFallbackQuote());
    } finally {
      setLoading(false);
    }
  };

  const getNewQuote = () => {
    fetchQuote();
  };

  useEffect(() => {
    // Check if we already have a quote for today
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quote-date');
    const savedQuote = localStorage.getItem('daily-quote');

    if (savedDate === today && savedQuote) {
      try {
        setQuote(JSON.parse(savedQuote));
        setLoading(false);
      } catch (error) {
        fetchQuote();
      }
    } else {
      fetchQuote();
    }
  }, []);

  useEffect(() => {
    // Save quote to localStorage when it changes
    if (quote) {
      const today = new Date().toDateString();
      localStorage.setItem('quote-date', today);
      localStorage.setItem('daily-quote', JSON.stringify(quote));
    }
  }, [quote]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Daily Quote
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Daily Quote
          </div>
          <Button variant="outline" size="sm" onClick={getNewQuote}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quote && (
          <div className="space-y-4">
            <div className="relative">
              <svg
                className="absolute -top-2 -left-2 h-8 w-8 text-purple-600/20 dark:text-purple-400/20"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-1.1.9-2 2-2h2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-1.1.9-2 2-2h2V8z" />
              </svg>
              <p className="text-lg italic text-gray-900 dark:text-gray-100 leading-relaxed pl-6">
                "{quote.text}"
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                — {quote.author}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
