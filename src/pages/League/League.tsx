import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material';
import type { Standing, Game, League as LeagueType } from '../../types';
import { SEASON } from '../../types';
import { getStandingsByLeague } from '../../services/standingService';
import { getGamesByLeague } from '../../services/gameService';
import { getLeagueById } from '../../services/leagueService';
import styles from './League.module.scss';

function getStatusClass(status: string, moduleStyles: Record<string, string>) {
  if (status === 'FT') return moduleStyles.statusFT;
  if (status === 'NS') return moduleStyles.statusUpcoming;
  return moduleStyles.statusLive;
}

function getStatusLabel(status: string) {
  if (status === 'FT') return 'Full Time';
  if (status === 'NS') return 'Upcoming';
  return status;
}

function FormPill({ result }: { result: string }) {
  if (result === 'W') return <div className={styles.formW}>W</div>;
  if (result === 'L') return <div className={styles.formL}>L</div>;
  return <div className={styles.formD}>D</div>;
}

function League() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [league, setLeague] = useState<LeagueType | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingStandings, setLoadingStandings] = useState<boolean>(true);
  const [loadingGames, setLoadingGames] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const id = Number(leagueId);

  useEffect(() => {
    if (!id) return;

    const fetchLeague = async () => {
      try {
        const data = await getLeagueById(id);
        setLeague(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStandings = async () => {
      try {
        const data = await getStandingsByLeague(id, SEASON);
        setStandings(data);
      } catch (err) {
        setError('Failed to load standings.');
        console.error(err);
      } finally {
        setLoadingStandings(false);
      }
    };

    const fetchGames = async () => {
      try {
        const data = await getGamesByLeague(id, SEASON);
        setGames(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchLeague();
    fetchStandings();
    fetchGames();
  }, [id]);

  if (loadingStandings && loadingGames) {
    return (
      <div className={styles.loading}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Typography>{error}</Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Back to Leagues
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {league?.logo && (
            <img
              src={league.logo}
              alt={league.name}
              style={{ width: '52px', height: '52px', objectFit: 'contain' }}
            />
          )}
          <div>
            <Typography className={styles.title}>
              {league?.name ?? 'League'}
            </Typography>
            <Typography className={styles.subtitle}>
              {league?.country_name} · Season {SEASON}
            </Typography>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tabsWrapper}>
          <Tabs
            value={tab}
            onChange={(_, newValue: number) => setTab(newValue)}
            TabIndicatorProps={{ style: { backgroundColor: '#3b82f6' } }}
          >
            <Tab label="Standings" className={styles.tab} />
            <Tab label="Games" className={styles.tab} />
          </Tabs>
        </div>

        {tab === 0 && (
          <>
            {standings.length === 0 ? (
              <div className={styles.empty}>
                <Typography>No standings available for this league</Typography>
              </div>
            ) : (
              <Table className={styles.table}>
                <TableHead className={styles.tableHead}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell align="center">P</TableCell>
                    <TableCell align="center">W</TableCell>
                    <TableCell align="center">D</TableCell>
                    <TableCell align="center">L</TableCell>
                    <TableCell align="center">PTS</TableCell>
                    <TableCell>Form</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings.map((standing) => (
                    <TableRow key={standing.id} className={styles.tableRow}>
                      <TableCell className={styles.position}>
                        {standing.position}
                      </TableCell>
                      <TableCell>
                        <div className={styles.teamCell}>
                          <img
                            src={standing.team_logo}
                            alt={standing.team_name}
                            className={styles.teamLogo}
                          />
                          <Typography className={styles.teamName}>
                            {standing.team_name}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">{standing.played}</TableCell>
                      <TableCell align="center">{standing.won}</TableCell>
                      <TableCell align="center">{standing.drawn}</TableCell>
                      <TableCell align="center">{standing.lost}</TableCell>
                      <TableCell align="center" className={styles.points}>
                        {standing.points}
                      </TableCell>
                      <TableCell>
                        <div className={styles.form}>
                          {standing.form?.split('').map((result, index) => (
                            <FormPill key={index} result={result} />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}

        {tab === 1 && (
          <>
            {loadingGames ? (
              <div className={styles.empty}>
                <CircularProgress sx={{ color: '#3b82f6' }} />
              </div>
            ) : games.length === 0 ? (
              <div className={styles.empty}>
                <Typography>No games available for this league</Typography>
              </div>
            ) : (
              <div className={styles.gameslist}>
                {games.map((game) => (
                  <Card key={game.id} className={styles.gameCard}>
                    <CardContent className={styles.gameCardContent}>
                      <Typography className={styles.gameWeek}>
                        Week {game.week}
                      </Typography>

                      <div className={styles.gameRow}>
                        <div className={styles.gameTeam}>
                          <img
                            src={game.home_team_logo}
                            alt={game.home_team_name}
                            className={styles.gameTeamLogo}
                          />
                          <Typography className={styles.gameTeamName}>
                            {game.home_team_name}
                          </Typography>
                        </div>

                        <div className={styles.scoreBlock}>
                          <Typography className={styles.score}>
                            {game.score_home ?? '-'}
                          </Typography>
                          <Typography className={styles.scoreDivider}>:</Typography>
                          <Typography className={styles.score}>
                            {game.score_away ?? '-'}
                          </Typography>
                        </div>

                        <div className={`${styles.gameTeam} ${styles.away}`}>
                          <img
                            src={game.away_team_logo}
                            alt={game.away_team_name}
                            className={styles.gameTeamLogo}
                          />
                          <Typography className={styles.gameTeamName}>
                            {game.away_team_name}
                          </Typography>
                        </div>
                      </div>

                      <Typography className={getStatusClass(game.status_short, styles)}>
                        {getStatusLabel(game.status_short)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default League;
