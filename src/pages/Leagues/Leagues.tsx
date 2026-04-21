import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CircularProgress, Typography } from '@mui/material';

import type { League } from '../../types/league';
import { getLeagues } from '../../services/leagueService';
import styles from './Leagues.module.scss';

function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getLeagues();
        setLeagues(data);
      } catch (err) {
        setError('Failed to fetch leagues.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

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
        <Typography className={styles.title}>Rugby Leagues</Typography>
        <Typography className={styles.subtitle}>
          {leagues.length} leagues available
        </Typography>
      </div>

      <div className={styles.grid}>
        {leagues.map((league) => (
          <Card
            key={league.id}
            className={styles.card}
            onClick={() => navigate(`/leagues/${league.id}/teams`)}
          >
            <CardContent className={styles.cardContent}>
              <div className={styles.logoContainer}>
                <img
                  src={league.logo}
                  alt={league.name}
                  className={styles.logo}
                />
              </div>

              <div className={styles.leagueInfo}>
                <Typography className={styles.leagueName}>
                  {league.name}
                </Typography>
                <div className={styles.leagueMeta}>
                  {league.country_flag && (
                    <img
                      src={league.country_flag}
                      alt={league.country_name}
                      className={styles.countryFlag}
                    />
                  )}
                  <Typography className={styles.countryName}>
                    {league.country_name}
                  </Typography>
                </div>
                <Typography className={styles.leagueType}>
                  {league.type}
                </Typography>
              </div>

              <Typography className={styles.arrow}>›</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Leagues;
