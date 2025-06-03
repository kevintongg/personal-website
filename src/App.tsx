import { SpeedInsights } from '@vercel/speed-insights/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Portfolio } from './components/Portfolio';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { Dashboard } from './pages/Dashboard';
import { Weather } from './pages/Weather';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
