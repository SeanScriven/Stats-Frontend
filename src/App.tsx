import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LeaguesPage from './pages/Leagues/Leagues.lazy';
import TeamsPage from './pages/Teams/Teams.lazy';

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<LeaguesPage />} />
        <Route path="/leagues/:leagueId/teams" element={<TeamsPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
