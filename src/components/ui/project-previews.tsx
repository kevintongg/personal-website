import { useEffect, useState } from 'react';

// Dashboard Preview Component
export function DashboardPreview() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-3 dark:from-gray-900 dark:to-gray-800">
      <div className="h-full w-full rounded-lg border bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {/* Mini Dashboard Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-gray-800">
          <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>

        {/* Mini Dashboard Grid */}
        <div className="grid h-full grid-cols-4 gap-1">
          {/* Clock Widget Preview */}
          <div className="col-span-2 flex flex-col items-center justify-center rounded bg-blue-50 p-1 dark:bg-blue-950/30">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[8px] text-blue-600 dark:text-blue-400">
              {time.toLocaleDateString()}
            </div>
          </div>

          {/* Weather Widget Preview */}
          <div className="flex flex-col items-center justify-center rounded bg-orange-50 p-1 dark:bg-orange-950/30">
            <div className="text-xs">☀️</div>
            <div className="text-[8px] text-orange-700 dark:text-orange-300">72°F</div>
          </div>

          {/* Quote Widget Preview */}
          <div className="flex items-center justify-center rounded bg-purple-50 p-1 dark:bg-purple-950/30">
            <div className="text-xs">💭</div>
          </div>

          {/* Todo Widget Preview */}
          <div className="col-span-2 rounded bg-green-50 p-1 dark:bg-green-950/30">
            <div className="mb-1 text-[8px] text-green-700 dark:text-green-300">Todo</div>
            <div className="space-y-0.5">
              <div className="h-1 w-full rounded bg-green-200 dark:bg-green-800"></div>
              <div className="h-1 w-3/4 rounded bg-green-200 dark:bg-green-800"></div>
              <div className="h-1 w-1/2 rounded bg-green-200 dark:bg-green-800"></div>
            </div>
          </div>

          {/* Bookmarks Widget Preview */}
          <div className="col-span-2 rounded bg-indigo-50 p-1 dark:bg-indigo-950/30">
            <div className="mb-1 text-[8px] text-indigo-700 dark:text-indigo-300">Links</div>
            <div className="grid grid-cols-3 gap-0.5">
              <div className="h-2 w-2 rounded-sm bg-indigo-200 dark:bg-indigo-800"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-200 dark:bg-indigo-800"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-200 dark:bg-indigo-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// E-Commerce Platform Preview
export function ECommercePreview() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const products = ['👟', '👕', '🎧'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProduct(prev => (prev + 1) % products.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-3">
      <div className="h-full w-full rounded-lg bg-white p-2 shadow-sm dark:bg-gray-950">
        {/* Mini Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-gray-800">
          <div className="h-2 w-12 rounded bg-blue-500"></div>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid h-full grid-cols-3 gap-1">
          {products.map((product, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center rounded bg-gray-50 p-1 transition-all duration-300 dark:bg-gray-900 ${
                index === currentProduct
                  ? 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950/50'
                  : ''
              }`}
            >
              <div className="mb-1 text-lg">{product}</div>
              <div className="h-1 w-8 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="mt-0.5 h-1 w-6 rounded bg-blue-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Task Management App Preview
export function TaskManagementPreview() {
  const [tasks, setTasks] = useState([
    { id: 1, completed: false, text: 'Design UI' },
    { id: 2, completed: true, text: 'Setup Backend' },
    { id: 3, completed: false, text: 'Testing' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prev =>
        prev.map(task => (Math.random() > 0.7 ? { ...task, completed: !task.completed } : task))
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 p-3">
      <div className="h-full w-full rounded-lg bg-white p-2 shadow-sm dark:bg-gray-950">
        {/* Mini Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-gray-800">
          <div className="h-2 w-16 rounded bg-green-500"></div>
          <div className="flex gap-1">
            <div className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid h-full grid-cols-3 gap-1">
          <div className="rounded bg-gray-50 p-1 dark:bg-gray-900">
            <div className="mb-1 text-[8px] text-gray-600 dark:text-gray-400">To Do</div>
            <div className="space-y-1">
              {tasks
                .filter(t => !t.completed)
                .map((task, _index) => (
                  <div
                    key={task.id}
                    className="flex h-3 items-center rounded border-l-2 border-red-400 bg-red-100 px-1 dark:bg-red-950/50"
                  >
                    <div className="h-1 w-full rounded bg-red-300 dark:bg-red-700"></div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded bg-gray-50 p-1 dark:bg-gray-900">
            <div className="mb-1 text-[8px] text-gray-600 dark:text-gray-400">Progress</div>
            <div className="flex h-3 items-center rounded border-l-2 border-yellow-400 bg-yellow-100 px-1 dark:bg-yellow-950/50">
              <div className="h-1 w-3/4 rounded bg-yellow-300 dark:bg-yellow-700"></div>
            </div>
          </div>

          <div className="rounded bg-gray-50 p-1 dark:bg-gray-900">
            <div className="mb-1 text-[8px] text-gray-600 dark:text-gray-400">Done</div>
            <div className="space-y-1">
              {tasks
                .filter(t => t.completed)
                .map((task, _index) => (
                  <div
                    key={task.id}
                    className="flex h-3 items-center rounded border-l-2 border-green-400 bg-green-100 px-1 dark:bg-green-950/50"
                  >
                    <div className="h-1 w-full rounded bg-green-300 dark:bg-green-700"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Weather Dashboard Preview
export function WeatherDashboardPreview() {
  const [weatherData, setWeatherData] = useState({ temp: 72, condition: '☀️' });
  const [chartData, setChartData] = useState([40, 60, 55, 75, 80, 70, 65]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherData({
        temp: Math.floor(Math.random() * 20) + 65,
        condition: ['☀️', '⛅', '🌧️', '❄️'][Math.floor(Math.random() * 4)],
      });
      setChartData(prev => [...prev.slice(1), Math.floor(Math.random() * 40) + 50]);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 p-3">
      <div className="h-full w-full rounded-lg bg-white p-2 shadow-sm dark:bg-gray-950">
        {/* Mini Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-gray-800">
          <div className="h-2 w-14 rounded bg-orange-500"></div>
          <div className="text-xs">{weatherData.condition}</div>
        </div>

        {/* Weather Content */}
        <div className="grid h-full grid-cols-2 gap-2">
          {/* Current Weather */}
          <div className="flex flex-col items-center justify-center rounded bg-gradient-to-br from-orange-50 to-orange-100 p-2 dark:from-orange-950/20 dark:to-orange-900/20">
            <div className="mb-1 text-2xl">{weatherData.condition}</div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
              {weatherData.temp}°
            </div>
            <div className="text-[8px] text-orange-600 dark:text-orange-400">New York</div>
          </div>

          {/* Chart Preview */}
          <div className="rounded bg-gray-50 p-1 dark:bg-gray-900">
            <div className="mb-1 text-[8px] text-gray-600 dark:text-gray-400">7-Day Forecast</div>
            <div className="flex h-full items-end justify-between pb-2">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-t bg-gradient-to-t from-orange-400 to-orange-300 transition-all duration-500 dark:from-orange-600 dark:to-orange-500"
                  style={{ height: `${(value / 100) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// EDM Events Preview Component
export function EdmEventsPreview() {
  const [activeGenre, setActiveGenre] = useState(0);
  const genres = ['All', 'Techno', 'House', 'Dubstep', 'Trance'];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGenre(prev => (prev + 1) % genres.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-3">
      <div className="h-full w-full rounded-lg bg-white p-2 shadow-sm dark:bg-gray-950">
        {/* Mini Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-gray-800">
          <div className="h-2 w-16 rounded bg-purple-500"></div>
          <div className="text-xs">🎵</div>
        </div>

        {/* Genre Filter Preview */}
        <div className="mb-2 flex gap-1">
          {genres.slice(0, 4).map((genre, index) => (
            <div
              key={genre}
              className={`rounded-full px-2 py-0.5 text-[8px] transition-colors ${
                index === activeGenre
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {genre}
            </div>
          ))}
        </div>

        {/* Events Grid Preview */}
        <div className="grid h-full grid-cols-2 gap-1 pb-4">
          {/* Event Card 1 */}
          <div className="rounded bg-gradient-to-br from-purple-400 to-blue-400 p-1">
            <div className="mb-1 rounded bg-white/20 px-1 py-0.5 text-[6px] text-white">Techno</div>
            <div className="text-[8px] font-bold text-white">Underground Night</div>
            <div className="text-[6px] text-white/80">Charlotte de Witte</div>
            <div className="mt-1 text-[6px] text-white/60">📍 Output Brooklyn</div>
          </div>

          {/* Event Card 2 */}
          <div className="rounded bg-gradient-to-br from-cyan-400 to-blue-400 p-1">
            <div className="mb-1 rounded bg-white/20 px-1 py-0.5 text-[6px] text-white">House</div>
            <div className="text-[8px] font-bold text-white">Deep Vibes</div>
            <div className="text-[6px] text-white/80">Disclosure</div>
            <div className="mt-1 text-[6px] text-white/60">📍 Webster Hall</div>
          </div>

          {/* Event Card 3 */}
          <div className="rounded bg-gradient-to-br from-pink-400 to-purple-400 p-1">
            <div className="mb-1 rounded bg-white/20 px-1 py-0.5 text-[6px] text-white">Trance</div>
            <div className="text-[8px] font-bold text-white">Paradise</div>
            <div className="text-[6px] text-white/80">Above & Beyond</div>
            <div className="mt-1 text-[6px] text-white/60">📍 Brooklyn Mirage</div>
          </div>

          {/* Event Card 4 */}
          <div className="rounded bg-gradient-to-br from-orange-400 to-red-400 p-1">
            <div className="mb-1 rounded bg-white/20 px-1 py-0.5 text-[6px] text-white">Bass</div>
            <div className="text-[8px] font-bold text-white">Future Nights</div>
            <div className="text-[6px] text-white/80">Illenium</div>
            <div className="mt-1 text-[6px] text-white/60">📍 Terminal 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
