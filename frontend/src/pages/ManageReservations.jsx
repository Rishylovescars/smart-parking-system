import React, { useEffect, useState } from 'react';
import ReservationTable from '../components/ReservationTable';
import { getAllReservations, cancelReservation } from '../services/api';
import { useToast } from '../context/ToastContext';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { addToast } = useToast();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const data = await getAllReservations(params);
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]);

  const handleCancelReservation = async (id) => {
    try {
      await cancelReservation(id);
      addToast(`Reservation #${id} has been cancelled.`, 'success');
      fetchReservations();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to cancel reservation.', 'error');
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div className="manage-reservations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Reservations</h1>
          <p className="page-subtitle">Inspect user bookings, apply status filters, and manage cancellations</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchReservations}>
          🔄 Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Filter by Status</label>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Filter by Date</label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div>
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
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
          <p>Loading reservations...</p>
        </div>
      ) : (
        <ReservationTable
          reservations={reservations}
          onCancel={handleCancelReservation}
          showActions={true}
        />
      )}
    </div>
  );
}

export default ManageReservations;
