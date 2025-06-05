# Kevin Tong - Personal Website

A modern, flexible personal website featuring interactive dashboards, weather applications, EDM event discovery, and professional portfolio showcase. Built with React, TypeScript, and Tailwind CSS v4.

## 🚀 Live Demo

- **Personal Home**: [Welcome](.)
- **Professional Portfolio**: [View Portfolio](/portfolio)
- **Personal Dashboard**: [View Dashboard](/dashboard)
- **Weather Dashboard**: [View Weather App](/weather)
- **EDM Events**: [Discover Events](/events)

## ✨ Features

### 🏠 Personal Home

- 🎯 **Simple Welcome Page** - Clean, personal introduction
- ⏰ **Live Clock** - Real-time display with 24-hour format
- 🧭 **Quick Navigation** - Easy access to main sections
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Mobile-responsive** - Optimized for all devices

### 💼 Professional Portfolio

- ✨ **Modern Design** - Professional presentation with dark mode
- 📱 **Mobile-first** - Fully responsive layout
- 🎯 **SEO Optimized** - Smooth scrolling navigation
- 💼 **Project Showcase** - Interactive live previews
- 📊 **Skills Section** - Animated progress bars
- 📧 **Contact Form** - Integrated contact system
- 🔗 **Social Links** - GitHub and professional profiles

### 📊 Personal Dashboard

- ⏰ **Live Clock Widget** - Real-time clock with date display
- 🌤️ **Weather Widget** - Current weather with location detection
- ✅ **Todo List** - Persistent task management with progress tracking
- 💡 **Quote Widget** - Daily inspirational quotes
- 🔖 **Bookmarks Widget** - Quick access to favorite websites
- 💾 **Local Storage** - All data persists across sessions

### 🌦️ Weather Dashboard

- 🌍 **Location Search** - Search and save multiple locations
- 📍 **Current Location** - Automatic geolocation detection
- 🌡️ **Current Weather** - Temperature, humidity, wind, UV index
- ⏰ **24-Hour Forecast** - Hourly weather predictions
- 📅 **7-Day Forecast** - Extended daily weather outlook
- 🚨 **Weather Alerts** - Severe weather warnings
- 💡 **Smart Recommendations** - Activity and clothing suggestions
- 🌬️ **Air Quality** - Real-time air pollution data
- 🔄 **Auto-refresh** - Smart caching with 10-minute updates

### 🎵 EDM Events Discovery

- 🌍 **Location-based Search** - Find events by city or current location
- 🎪 **Real Event Data** - Powered by Edmtrain API
- 🎯 **Genre Filtering** - Filter by music genres with event counts
- 📅 **Event Details** - Venue, date, time, and artist information
- 🎫 **Ticket Links** - Direct links to purchase tickets
- 🔄 **Smart Caching** - Optimized API usage with refresh capability
- 📱 **Responsive Design** - Beautiful cards layout

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **shadcn/ui** - Beautiful and accessible component library

### APIs & Services

- **OpenWeather API** - Weather data and forecasts
- **OneCall 3.0 API** - Enhanced weather features (UV index, alerts, extended forecasts)
- **Geocoding API** - Location search and coordinates
- **Air Quality API** - Pollution data and health recommendations
- **Edmtrain API** - Electronic dance music event discovery

### Development Tools

- **Vite** - Fast build tool and development server
- **ESLint** - Code linting with React, TypeScript, and accessibility rules
- **Prettier** - Code formatting with Tailwind CSS class sorting
- **EditorConfig** - Consistent coding styles across editors

### Performance & Analytics

- **Vercel Speed Insights** - Performance monitoring
- **Code Splitting** - Optimized bundle loading
- **Responsive Images** - Optimized asset delivery

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kevintongg/portfolio.git
cd personal-website

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Add your API keys to .env.local
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_EDMTRAIN_API_KEY=your_edmtrain_api_key

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint code with ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_EDMTRAIN_API_KEY=your_edmtrain_api_key
```

### API Keys Required

1. **OpenWeather API Key** - Get free key at [openweathermap.org](https://openweathermap.org/api)

   - Used for weather data, forecasts, and air quality
   - Free tier: 1,000 calls/day
   - OneCall 3.0: Enhanced features with subscription

2. **Edmtrain API Key** - Get free key at [edmtrain.com](https://edmtrain.com/api)
   - Used for electronic dance music event discovery
   - Free tier: 100 calls/day
   - Location-based event search

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Personal dashboard widgets
│   │   ├── BookmarksWidget.tsx
│   │   ├── ClockWidget.tsx
│   │   ├── QuoteWidget.tsx
│   │   ├── TodoWidget.tsx
│   │   └── WeatherWidget.tsx
│   ├── weather/           # Weather dashboard components
│   │   ├── AirQualityCard.tsx
│   │   ├── CurrentWeatherCard.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── LocationSearch.tsx
│   │   ├── WeatherAlerts.tsx
│   │   ├── WeatherDetailsCard.tsx
│   │   ├── WeatherRecommendations.tsx
│   │   └── WindSunCard.tsx
│   ├── edm-events/        # EDM events components
│   │   └── LocationSelector.tsx
│   ├── ui/                # Reusable UI components
│   ├── Home.tsx           # Personal home page
│   └── Portfolio.tsx      # Professional portfolio
├── contexts/              # React contexts
│   └── DarkModeContext.tsx
├── lib/                   # Utilities and services
│   ├── weather/
│   │   ├── weatherService.ts
│   │   └── types.ts
│   └── edmtrain/          # Edmtrain API integration
│       ├── edmtrainService.ts
│       └── types.ts
├── pages/                 # Route pages
│   ├── Dashboard.tsx
│   ├── Weather.tsx
│   └── EdmEvents.tsx
└── App.tsx               # Application entry point

public/                   # Static assets
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue gradient (blue-600 to purple-600)
- **Surface**: White/Gray-950 (light/dark mode)
- **Text**: Gray-900/Gray-100 (light/dark mode)
- **Accent Colors**: Blue, Purple, Green, Orange, Red for different widgets

### Typography

- **Headings**: Font-bold with responsive sizing
- **Body**: Leading-relaxed for readability
- **Code**: Monospace with syntax highlighting

### Components

- **Consistent spacing** using Tailwind's spacing scale
- **Rounded corners** for modern feel
- **Hover states** and smooth transitions
- **Dark mode** support throughout
- **Centered titles** with left-aligned descriptions for cards

## 🌟 Key Features Explained

### Flexible Website Architecture

- **Personal Home** (`/`) - Casual, welcoming landing page
- **Professional Portfolio** (`/portfolio`) - Formal showcase for employers
- **Functional Apps** - Dashboard, Weather, and Events as separate experiences
- **Easy Navigation** - Both navigation bar and card-based quick access

### Smart Caching Systems

- **Weather**: 10-minute cache duration for optimal performance
- **EDM Events**: Location-based caching with manual refresh options
- **Automatic cache invalidation** and refresh
- **Fallback strategies** for API failures

### Real-time Features

- **Live Clock** - Updates every second with 24-hour format
- **Dynamic Time Display** - Shows current date and time on home page
- **Auto-refresh Weather** - Background updates every 10 minutes
- **Event Data Sync** - Real-time event information from Edmtrain

### Accessibility & UX

- **ARIA labels** and semantic HTML elements
- **Keyboard navigation** support throughout
- **Screen reader** optimizations
- **Focus indicators** for interactive elements
- **Loading states** with centered spinners
- **Error handling** with user-friendly messages

### Responsive Design

- **Mobile-first** approach with progressive enhancement
- **Flexible grid systems** for different screen sizes
- **Touch-friendly** interface elements
- **Optimized layouts** for tablets and desktops

### Data Persistence

- **Local storage** for user preferences
- **Saved locations** for weather dashboard
- **Todo items and bookmarks** persist across sessions
- **Theme preference** memory
- **Event cache** for improved performance

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_OPENWEATHER_API_KEY`
   - `VITE_EDMTRAIN_API_KEY`
3. Deploy automatically on push

### Manual Build

```bash
pnpm build
# Upload dist/ folder to your hosting provider
```

## 📱 Navigation Structure

```
/ (Home)                    # Personal welcome page
├── /portfolio             # Professional portfolio showcase
├── /dashboard             # Personal productivity dashboard
├── /weather              # Weather application
└── /events               # EDM events discovery
```

## 🤝 Contributing

While this is a personal website, suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📝 License

MIT License - feel free to use this as a template for your own personal website!

## 🙏 Acknowledgments

- [OpenWeather](https://openweathermap.org/) for weather data APIs
- [Edmtrain](https://edmtrain.com/) for electronic dance music event data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Vercel](https://vercel.com/) for hosting and analytics

---

Built with ❤️ by Kevin Tong | [Home](/) | [Portfolio](/portfolio) | [Dashboard](/dashboard) | [Weather](/weather) | [Events](/events)
