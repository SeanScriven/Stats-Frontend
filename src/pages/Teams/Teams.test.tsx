import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Teams from './Teams';
import * as teamService from '../../services/teamService';
import type { Team } from '../../types';

const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Alumni',
    logo: 'https://example.com/logo.png',
    country_name: 'Argentina',
    country_code: 'AR',
    country_flag: 'https://example.com/flag.png',
    league_id: 1
  },
  {
    id: 2,
    name: 'Belgrano',
    logo: 'https://example.com/logo2.png',
    country_name: 'Argentina',
    country_code: 'AR',
    country_flag: 'https://example.com/flag2.png',
    league_id: 1
  }
];

const renderWithRouter = (leagueId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/leagues/${leagueId}/teams`]}>
      <Routes>
        <Route path="/leagues/:leagueId/teams" element={<Teams />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Teams Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner initially', () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('renders team cards after fetching', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Alumni')).toBeInTheDocument();
      expect(screen.getByText('Belgrano')).toBeInTheDocument();
    });
  });

  it('renders the correct team count in subtitle', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('2 teams in this league')).toBeInTheDocument();
    });
  });

  it('renders country names for each team', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();

    await waitFor(() => {
      const countryNames = screen.getAllByText('Argentina');
      expect(countryNames).toHaveLength(mockTeams.length);
    });
  });

  it('shows empty state when no teams are returned', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No teams found for this league')).toBeInTheDocument();
    });
  });

  it('shows an error message when fetch fails', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockRejectedValue(new Error('Network error'));
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch teams.')).toBeInTheDocument();
    });
  });

  it('renders the correct number of cards', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();

    await waitFor(() => {
      const cards = document.querySelectorAll('.MuiCard-root');
      expect(cards).toHaveLength(mockTeams.length);
    });
  });

  it('renders a back button', async () => {
    vi.spyOn(teamService, 'getTeamsByLeague').mockResolvedValue(mockTeams);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/back to leagues/i)).toBeInTheDocument();
    });
  });
});
