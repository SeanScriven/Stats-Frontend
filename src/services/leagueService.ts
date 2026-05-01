import httpClient from '../api/http-client';
import type { League } from '../types';

export const getLeagues = async (): Promise<League[]> => {
  const response = await httpClient.get<League[]>('/leagues/');
  return response.data;
};

export const getLeagueById = async (id: number): Promise<League> => {
  const response = await httpClient.get<League>(`/leagues/${id}`);
  return response.data;
};
