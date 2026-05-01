import httpClient from '../api/http-client';
import type { Team } from '../types';

export const getTeamsByLeague = async (leagueId: number): Promise<Team[]> => {
  const response = await httpClient.get<Team[]>('/teams/', {
    params: { league_id: leagueId }
  });
  return response.data;
};
