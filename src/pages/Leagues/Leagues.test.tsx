import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Leagues from './Leagues';
import * as leagueService from '../../services/leagueService';
import type { League } from '../../types/league';

const mockLeagues: League[] = [
  {
    id: 1,
    name: 'Top 12',
    type: 'League',
    logo: 'https://example.com/logo.png',
    country_name: 'France',
    country_code: 'FR',
    country_flag: 'https://example.com/flag.png'
  },
  {
    id: 2,
    name: 'Premiership',
    type: 'League',
    logo: 'https://example.com/logo2.png',
    country_name: 'England',
    country_code: 'GB',
    country_flag: 'https://example.com/flag2.png'
  }
];

describe('Leagues Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner initially', () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('renders league cards after fetching', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Top 12')).toBeInTheDocument();
      expect(screen.getByText('Premiership')).toBeInTheDocument();
    });
  });

  it('renders country names', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('England')).toBeInTheDocument();
    });
  });

  it('renders the correct league count in subtitle', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2 leagues available')).toBeInTheDocument();
    });
  });

  it('renders league type badges', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      const badges = screen.getAllByText('League');
      expect(badges).toHaveLength(mockLeagues.length);
    });
  });

  it('shows an error message when fetch fails', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch leagues.')).toBeInTheDocument();
    });
  });

  it('renders the correct number of cards', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(
      <MemoryRouter>
        <Leagues />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cards = document.querySelectorAll('.MuiCard-root');
      expect(cards).toHaveLength(mockLeagues.length);
    });
  });
});
