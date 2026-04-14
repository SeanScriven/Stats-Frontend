import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    country_flag: 'https://example.com/flag.png',
  },
  {
    id: 2,
    name: 'Premiership',
    type: 'League',
    logo: 'https://example.com/logo2.png',
    country_name: 'England',
    country_code: 'GB',
    country_flag: 'https://example.com/flag2.png',
  },
];

describe('Leagues Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading state initially', () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(<Leagues />);
    expect(screen.getByText('Loading leagues...')).toBeInTheDocument();
  });

  it('renders leagues after fetching', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(<Leagues />);

    await waitFor(() => {
      expect(screen.getByText('Top 12 - France')).toBeInTheDocument();
      expect(screen.getByText('Premiership - England')).toBeInTheDocument();
    });
  });

  it('shows an error message when the fetch fails', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockRejectedValue(new Error('Network error'));
    render(<Leagues />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch leagues.')).toBeInTheDocument();
    });
  });

  it('renders the correct number of leagues', async () => {
    vi.spyOn(leagueService, 'getLeagues').mockResolvedValue(mockLeagues);
    render(<Leagues />);

    await waitFor(() => {
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(mockLeagues.length);
    });
  });
});
