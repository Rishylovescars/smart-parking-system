import React, { useState } from 'react';
import ReservationTable from '../components/ReservationTable';
import { getReservationById, searchReservationsByVehicle, cancelReservation } from '../services/api';
import { useToast } from '../context/ToastContext';

function MyReservations() {
  const [searchType, setSearchType] = useState('vehicle'); // 'id' or 'vehicle'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      if (searchType === 'id') {
        const data = await getReservationById(query.trim());
        setResults(data ? [data] : []);
      } else {
        const data = await searchReservationsByVehicle(query.trim());
        setResults(Array.isArray(data) ? data : (data ? [data] : []));
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setError(err.message || 'No reservation found matching the given query.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      addToast(`Reservation #${id} has been cancelled successfully.`, 'success');
      // Update local state
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
      );
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to cancel reservation.', 'error');
    }
  };

  return (
    <div className="my-reservations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Reservations</h1>
          <p className="page-subtitle">Track, review, or cancel your existing bookings</p>
        </div>
      </div>

      {/* Search Section */}
      <div
        className="filter-bar"
        style={{
          display: 'block',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
        }}
      >
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="searchType"
                value="vehicle"
                checked={searchType === 'vehicle'}
                onChange={() => setSearchType('vehicle')}
              />
              Search by Vehicle Number
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="searchType"
                value="id"
                checked={searchType === 'id'}
                onChange={() => setSearchType('id')}
              />
              Search by Reservation ID
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              style={{ flex: 1, minWidth: '220px' }}
              placeholder={searchType === 'vehicle' ? 'e.g. KA-01-AB-1234 or ABC-1234' : 'e.g. 1, 2, 42...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="search-reservation-btn"
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
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
            textAlign: 'center',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Looking up reservations...</p>
        </div>
      ) : hasSearched && results.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h4 className="empty-title">No Matching Records</h4>
          <p className="empty-desc">
            We couldn't find any reservations associated with "{query}".
          </p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Search Results ({results.length})</h2>
          <ReservationTable reservations={results} onCancel={handleCancel} showActions={true} />
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h4 className="empty-title">Find Your Reservation</h4>
          <p className="empty-desc">
            Enter your vehicle registration number or reservation ID above to check booking details.
          </p>
        </div>
      )}
    </div>
  );
}

export default MyReservations;
