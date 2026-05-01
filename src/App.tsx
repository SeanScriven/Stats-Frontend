import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LeaguesPage from './pages/Leagues/Leagues.lazy';
import LeaguePage from './pages/League/League.lazy';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<ErrorBoundary><LeaguesPage /></ErrorBoundary>} />
        <Route path="/leagues/:leagueId" element={<ErrorBoundary><LeaguePage /></ErrorBoundary>} />
      </Routes>
    </Suspense>
  );
}

export default App;
