import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { getAdminStatistics } from '../services/api';

function Home() {
  const [stats, setStats] = useState({
    totalSpaces: 0,
    availableSpaces: 0,
    occupiedSpaces: 0,
    totalReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getAdminStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load home statistics:', err);
        setError('Could not connect to backend server. Make sure the backend is running on port 8080.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 3.5rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            color: 'var(--primary-accent)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          <span>✨</span> Smart Campus Parking Solution
        </div>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            lineHeight: '1.15',
            marginBottom: '1rem',
          }}
        >
          Seamless Parking Management for Modern Campuses
        </h1>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
          }}
        >
          Check live slot availability in real time, book spots instantly, and simplify vehicle parking across all facility blocks.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/parking" className="btn btn-primary btn-lg">
            🚗 View Parking Spaces
          </Link>
          <Link to="/reservations" className="btn btn-secondary btn-lg">
            🔍 My Reservations
          </Link>
          <Link to="/admin" className="btn btn-secondary btn-lg">
            ⚙️ Admin Dashboard
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Live Overview</h2>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading real-time parking stats...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <StatCard
              title="Total Parking Spaces"
              value={stats.totalSpaces}
              icon="🅿️"
              color="#3b82f6"
            />
            <StatCard
              title="Available Spaces"
              value={stats.availableSpaces}
              icon="✅"
              color="#22c55e"
            />
            <StatCard
              title="Occupied Spaces"
              value={stats.occupiedSpaces}
              icon="🚗"
              color="#ef4444"
            />
            <StatCard
              title="Total Reservations"
              value={stats.totalReservations}
              icon="📋"
              color="#f59e0b"
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
