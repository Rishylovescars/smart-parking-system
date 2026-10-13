import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { getAdminStatistics } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSpaces: 0,
    availableSpaces: 0,
    occupiedSpaces: 0,
    totalReservations: 0,
    activeReservations: 0,
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
        console.error(err);
        setError('Failed to fetch admin stats. Ensure backend server is active.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Real-time system telemetry and administration portal</p>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Row */}
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
              icon="🚫"
              color="#ef4444"
            />
            <StatCard
              title="Total Reservations"
              value={stats.totalReservations}
              icon="📊"
              color="#8b5cf6"
            />
            <StatCard
              title="Active Reservations"
              value={stats.activeReservations ?? 0}
              icon="⚡"
              color="#f59e0b"
            />
          </div>

          {/* Quick Management Shortcuts */}
          <h2 style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
            Administrative Actions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚙</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Manage Parking Spaces</h3>
                <p style={{ fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Add new parking slots, modify vehicle categories, update spot assignments, or remove existing spaces.
                </p>
              </div>
              <Link to="/admin/parking" className="btn btn-primary" style={{ width: '100%' }}>
                Manage Parking Spaces &rarr;
              </Link>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📑</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Manage Reservations</h3>
                <p style={{ fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Filter all system bookings by status and date, audit driver vehicle numbers, and manually cancel spots if necessary.
                </p>
              </div>
              <Link to="/admin/reservations" className="btn btn-secondary" style={{ width: '100%' }}>
                Manage Reservations &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
