export interface Standing {
  id: number;
  league_id: number;
  season: number;
  team_id: number;
  team_name: string;
  team_logo: string;
  position: number;
  stage: string;
  group_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  form: string;
}
