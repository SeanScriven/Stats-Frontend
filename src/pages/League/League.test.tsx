import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import League from './League';
import * as standingService from '../../services/standingService';
import * as gameService from '../../services/gameService';
import * as leagueService from '../../services/leagueService';
import type { Standing, Game, League as LeagueType } from '../../types';

const mockLeague: LeagueType = {
  id: 1,
  name: 'Top 12',
  type: 'League',
  logo: 'https://example.com/logo.png',
  country_name: 'Argentina',
  country_code: 'AR',
  country_flag: 'https://example.com/flag.png'
};

const mockStandings: Standing[] = [
  {
    id: 1,
    league_id: 1,
    season: 2024,
    team_id: 1,
    team_name: 'Alumni',
    team_logo: 'https://example.com/logo.png',
    position: 1,
    stage: 'Regular Season',
    group_name: 'Regular Season',
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goals_for: 200,
    goals_against: 100,
    points: 33,
    form: 'WWLWW'
  },
  {
    id: 2,
    league_id: 1,
    season: 2024,
    team_id: 2,
    team_name: 'Belgrano',
    team_logo: 'https://example.com/logo2.png',
    position: 2,
    stage: 'Regular Season',
    group_name: 'Regular Season',
    played: 10,
    won: 7,
    drawn: 0,
    lost: 3,
    goals_for: 180,
    goals_against: 120,
    points: 28,
    form: 'WLLWW'
  }
];

const mockGames: Game[] = [
  {
    id: 1,
    league_id: 1,
    season: 2024,
    date: '2024-04-06T18:30:00+00:00',
    time: '18:30',
    week: '1',
    status_long: 'Full Time',
    status_short: 'FT',
    home_team_id: 1,
    home_team_name: 'Alumni',
    home_team_logo: 'https://example.com/logo.png',
    away_team_id: 2,
    away_team_name: 'Belgrano',
    away_team_logo: 'https://example.com/logo2.png',
    score_home: 37,
    score_away: 30,
    period_first_home: 20,
    period_first_away: 15,
    period_second_home: 17,
    period_second_away: 15
  }
];

const renderWithRouter = (leagueId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/leagues/${leagueId}`]}>
      <Routes>
        <Route path="/leagues/:leagueId" element={<League />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('League Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(leagueService, 'getLeagueById').mockResolvedValue(mockLeague);
    vi.spyOn(standingService, 'getStandingsByLeague').mockResolvedValue(mockStandings);
    vi.spyOn(gameService, 'getGamesByLeague').mockResolvedValue(mockGames);
  });

  it('shows a loading spinner initially', () => {
    renderWithRouter();
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('renders the league name as the title', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Top 12')).toBeInTheDocument();
    });
  });

  it('renders the country name in the subtitle', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/Argentina/)).toBeInTheDocument();
    });
  });

  it('renders standings tab by default', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Alumni')).toBeInTheDocument();
      expect(screen.getByText('Belgrano')).toBeInTheDocument();
    });
  });

  it('renders standings table columns', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getByText('PTS')).toBeInTheDocument();
      expect(screen.getByText('Form')).toBeInTheDocument();
    });
  });

  it('renders correct points for each team', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('33')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
    });
  });

  it('switches to games tab when clicked', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Games')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Games'));

    await waitFor(() => {
      expect(screen.getByText('37')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });

  it('renders full time status on finished games', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Games')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Games'));

    await waitFor(() => {
      expect(screen.getByText('Full Time')).toBeInTheDocument();
    });
  });

  it('shows empty state when no standings available', async () => {
    vi.spyOn(standingService, 'getStandingsByLeague').mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No standings available for this league')).toBeInTheDocument();
    });
  });

  it('shows empty state when no games available', async () => {
    vi.spyOn(gameService, 'getGamesByLeague').mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Games')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Games'));

    await waitFor(() => {
      expect(screen.getByText('No games available for this league')).toBeInTheDocument();
    });
  });

  it('renders a back button', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/back to leagues/i)).toBeInTheDocument();
    });
  });
});
