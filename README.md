# Kevin Tong - Portfolio

A modern, comprehensive portfolio website featuring interactive dashboards, weather applications, and beautiful responsive design. Built with React, TypeScript, and Tailwind CSS v4.

## 🚀 Live Demo

- **Portfolio Homepage**: [View Portfolio](/)
- **Personal Dashboard**: [View Dashboard](/dashboard)
- **Weather Dashboard**: [View Weather App](/weather)

## ✨ Features

### 🏠 Portfolio Homepage
- ✨ Modern, responsive design with dark mode
- 📱 Mobile-first responsive layout
- 🎯 SEO optimized with smooth scrolling navigation
- 💼 Project showcase with live previews
- 📧 Contact form with validation
- 🔗 Social links and downloadable resume

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
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Add your OpenWeather API key to .env.local
VITE_OPENWEATHER_API_KEY=your_api_key_here

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
```

### API Keys Required

1. **OpenWeather API Key** - Get free key at [openweathermap.org](https://openweathermap.org/api)
   - Used for weather data, forecasts, and air quality
   - Free tier: 1,000 calls/day
   - OneCall 3.0: Enhanced features with subscription

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
│   ├── ui/               # Reusable UI components
│   └── Portfolio.tsx     # Main portfolio component
├── contexts/             # React contexts
│   └── DarkModeContext.tsx
├── lib/                  # Utilities and services
│   └── weather/
│       ├── weatherService.ts
│       └── types.ts
├── pages/               # Route pages
│   ├── Dashboard.tsx
│   └── Weather.tsx
└── App.tsx             # Application entry point

public/                 # Static assets
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

## 🌟 Key Features Explained

### Smart Weather Caching
- 10-minute cache duration for optimal performance
- Automatic cache invalidation and refresh
- Fallback to basic APIs if OneCall 3.0 fails
- Error handling with user-friendly messages

### Responsive Design
- Mobile-first approach with progressive enhancement
- Flexible grid systems for different screen sizes
- Touch-friendly interface elements
- Optimized for tablets and desktops

### Data Persistence
- Local storage for user preferences
- Saved locations for weather dashboard
- Todo items and bookmarks persist across sessions
- Theme preference memory

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader optimizations
- High contrast mode compatibility

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Build
```bash
pnpm build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 🙏 Acknowledgments

- [OpenWeather](https://openweathermap.org/) for weather data APIs
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Vercel](https://vercel.com/) for hosting and analytics

---

Built with ❤️ by Kevin Tong | [Portfolio](/) | [Dashboard](/dashboard) | [Weather](/weather)
