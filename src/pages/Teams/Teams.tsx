import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
import type { Team } from '../../types/team';
import { getTeamsByLeague } from '../../services/teamService';
import styles from './Teams.module.scss';

function Teams() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!leagueId) return;

    const fetchTeams = async () => {
      try {
        const data = await getTeamsByLeague(Number(leagueId));
        setTeams(data);
      } catch (err) {
        setError('Failed to fetch teams.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [leagueId]);

  if (loading) {
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
        <button
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          <span className={styles.backArrow}>←</span>
          Back to Leagues
        </button>

        <Typography className={styles.title}>Teams</Typography>
        <Typography className={styles.subtitle}>
          {teams.length} teams in this league
        </Typography>
      </div>

      {teams.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏉</div>
          <Typography>No teams found for this league</Typography>
        </div>
      ) : (
        <div className={styles.grid}>
          {teams.map((team) => (
            <Card key={team.id} className={styles.card}>
              <CardContent className={styles.cardContent}>
                <div className={styles.logoContainer}>
                  <img
                    src={team.logo}
                    alt={team.name}
                    className={styles.logo}
                  />
                </div>

                <div className={styles.teamInfo}>
                  <Typography className={styles.teamName}>
                    {team.name}
                  </Typography>
                  <div className={styles.teamMeta}>
                    {team.country_flag && (
                      <img
                        src={team.country_flag}
                        alt={team.country_name}
                        className={styles.countryFlag}
                      />
                    )}
                    <Typography className={styles.countryName}>
                      {team.country_name}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
