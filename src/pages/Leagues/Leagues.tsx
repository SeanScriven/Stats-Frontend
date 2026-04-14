import { useEffect, useState } from 'react';
import type { League } from '../../types/league';
import { getLeagues } from '../../services/leagueService';

function Leagues() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <p>Loading leagues...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Rugby Leagues</h1>
            <ul>
                {leagues.map((league) => (
                    <li key={league.id}>
                        <img src={league.logo} alt={league.name} width={30} />
                        {league.name} - {league.country_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leagues;