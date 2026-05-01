import httpClient from '../api/http-client';
import type { Standing } from '../types';

export const getStandingsByLeague = async (leagueId: number, season: number): Promise<Standing[]> => {
  const response = await httpClient.get<Standing[]>('/standings/', {
    params: { league_id: leagueId, season }
  });
  return response.data;
};
