export interface Game {
  id: number;
  league_id: number;
  season: number;
  date: string;
  time: string;
  week: string;
  status_long: string;
  status_short: string;
  home_team_id: number;
  home_team_name: string;
  home_team_logo: string;
  away_team_id: number;
  away_team_name: string;
  away_team_logo: string;
  score_home: number | null;
  score_away: number | null;
  period_first_home: number | null;
  period_first_away: number | null;
  period_second_home: number | null;
  period_second_away: number | null;
}
