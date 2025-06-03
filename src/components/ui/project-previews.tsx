import { useEffect, useState } from 'react';

// Dashboard Preview Component
export function DashboardPreview() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 overflow-hidden">
      <div className="h-full w-full bg-white dark:bg-gray-950 rounded-lg shadow-sm border dark:border-gray-800 p-2">
        {/* Mini Dashboard Header */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b dark:border-gray-800">
          <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        </div>

        {/* Mini Dashboard Grid */}
        <div className="grid grid-cols-4 gap-1 h-full">
          {/* Clock Widget Preview */}
          <div className="col-span-2 bg-blue-50 dark:bg-blue-950/30 rounded p-1 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[8px] text-blue-600 dark:text-blue-400">
              {time.toLocaleDateString()}
            </div>
          </div>

          {/* Weather Widget Preview */}
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded p-1 flex flex-col items-center justify-center">
            <div className="text-xs">☀️</div>
            <div className="text-[8px] text-orange-700 dark:text-orange-300">72°F</div>
          </div>

          {/* Quote Widget Preview */}
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded p-1 flex items-center justify-center">
            <div className="text-xs">💭</div>
          </div>

          {/* Todo Widget Preview */}
          <div className="col-span-2 bg-green-50 dark:bg-green-950/30 rounded p-1">
            <div className="text-[8px] text-green-700 dark:text-green-300 mb-1">Todo</div>
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-green-200 dark:bg-green-800 rounded"></div>
              <div className="h-1 w-3/4 bg-green-200 dark:bg-green-800 rounded"></div>
              <div className="h-1 w-1/2 bg-green-200 dark:bg-green-800 rounded"></div>
            </div>
          </div>

          {/* Bookmarks Widget Preview */}
          <div className="col-span-2 bg-indigo-50 dark:bg-indigo-950/30 rounded p-1">
            <div className="text-[8px] text-indigo-700 dark:text-indigo-300 mb-1">Links</div>
            <div className="grid grid-cols-3 gap-0.5">
              <div className="h-2 w-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm"></div>
              <div className="h-2 w-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm"></div>
              <div className="h-2 w-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm"></div>
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
      setCurrentProduct((prev) => (prev + 1) % products.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 overflow-hidden">
      <div className="h-full w-full bg-white dark:bg-gray-950 rounded-lg shadow-sm p-2">
        {/* Mini Header */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b dark:border-gray-800">
          <div className="h-2 w-12 bg-blue-500 rounded"></div>
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-1 h-full">
          {products.map((product, index) => (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-gray-900 rounded p-1 flex flex-col items-center justify-center transition-all duration-300 ${
                index === currentProduct ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50' : ''
              }`}
            >
              <div className="text-lg mb-1">{product}</div>
              <div className="h-1 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-1 w-6 bg-blue-500 rounded mt-0.5"></div>
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
      setTasks(prev => prev.map(task =>
        Math.random() > 0.7 ? { ...task, completed: !task.completed } : task
      ));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full bg-gradient-to-br from-green-500 to-teal-600 p-3 overflow-hidden">
      <div className="h-full w-full bg-white dark:bg-gray-950 rounded-lg shadow-sm p-2">
        {/* Mini Header */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b dark:border-gray-800">
          <div className="h-2 w-16 bg-green-500 rounded"></div>
          <div className="flex gap-1">
            <div className="h-2 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-3 gap-1 h-full">
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-1">
            <div className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">To Do</div>
            <div className="space-y-1">
              {tasks.filter(t => !t.completed).map((task, index) => (
                <div key={task.id} className="h-3 bg-red-100 dark:bg-red-950/50 rounded border-l-2 border-red-400 px-1 flex items-center">
                  <div className="h-1 w-full bg-red-300 dark:bg-red-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded p-1">
            <div className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">Progress</div>
            <div className="h-3 bg-yellow-100 dark:bg-yellow-950/50 rounded border-l-2 border-yellow-400 px-1 flex items-center">
              <div className="h-1 w-3/4 bg-yellow-300 dark:bg-yellow-700 rounded"></div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded p-1">
            <div className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">Done</div>
            <div className="space-y-1">
              {tasks.filter(t => t.completed).map((task, index) => (
                <div key={task.id} className="h-3 bg-green-100 dark:bg-green-950/50 rounded border-l-2 border-green-400 px-1 flex items-center">
                  <div className="h-1 w-full bg-green-300 dark:bg-green-700 rounded"></div>
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
        condition: ['☀️', '⛅', '🌧️', '❄️'][Math.floor(Math.random() * 4)]
      });
      setChartData(prev => [
        ...prev.slice(1),
        Math.floor(Math.random() * 40) + 50
      ]);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-48 w-full bg-gradient-to-br from-orange-500 to-red-600 p-3 overflow-hidden">
      <div className="h-full w-full bg-white dark:bg-gray-950 rounded-lg shadow-sm p-2">
        {/* Mini Header */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b dark:border-gray-800">
          <div className="h-2 w-14 bg-orange-500 rounded"></div>
          <div className="text-xs">{weatherData.condition}</div>
        </div>

        {/* Weather Content */}
        <div className="grid grid-cols-2 gap-2 h-full">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded p-2 flex flex-col items-center justify-center">
            <div className="text-2xl mb-1">{weatherData.condition}</div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{weatherData.temp}°</div>
            <div className="text-[8px] text-orange-600 dark:text-orange-400">New York</div>
          </div>

          {/* Chart Preview */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-1">
            <div className="text-[8px] text-gray-600 dark:text-gray-400 mb-1">7-Day Forecast</div>
            <div className="flex items-end justify-between h-full pb-2">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500 w-1 rounded-t transition-all duration-500"
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
