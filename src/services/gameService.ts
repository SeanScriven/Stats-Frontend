import httpClient from '../api/http-client';
import type { Game } from '../types';

export const getGamesByLeague = async (leagueId: number, season: number): Promise<Game[]> => {
  const response = await httpClient.get<Game[]>('/games/', {
    params: { league_id: leagueId, season }
  });
  return response.data;
};
