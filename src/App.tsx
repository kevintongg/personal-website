import { SpeedInsights } from '@vercel/speed-insights/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Portfolio } from './components/Portfolio';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { Dashboard } from './pages/Dashboard';
import { EdmEvents } from './pages/EdmEvents';
import { Weather } from './pages/Weather';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<EdmEvents />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
