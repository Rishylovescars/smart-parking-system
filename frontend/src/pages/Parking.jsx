import React, { useEffect, useState } from 'react';
import ParkingCard from '../components/ParkingCard';
import ReservationForm from '../components/ReservationForm';
import { getAllParkingSpaces } from '../services/api';
import { useToast } from '../context/ToastContext';

function Parking() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [status, setStatus] = useState('');

  // Modal reservation state
  const [selectedSpace, setSelectedSpace] = useState(null);
  const { addToast } = useToast();

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (location) params.location = location;
      if (vehicleType) params.vehicleType = vehicleType;
      if (status) params.status = status;

      const data = await getAllParkingSpaces(params);
      setSpaces(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch parking spaces. Backend may be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [location, vehicleType, status]);

  // Client search filter by spaceNumber
  const filteredSpaces = spaces.filter((s) => {
    if (!search.trim()) return true;
    return s.spaceNumber.toLowerCase().includes(search.trim().toLowerCase());
  });

  const handleReserveSuccess = (reservation) => {
    addToast(`Reservation #${reservation.id} booked successfully!`, 'success');
    fetchSpaces();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setVehicleType('');
    setStatus('');
  };

  return (
    <div className="parking-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parking Spaces</h1>
          <p className="page-subtitle">Browse and reserve available slots in real time</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchSpaces}>
          🔄 Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Search Space</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. A-101"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Location</label>
          <select
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Vehicle Type</label>
          <select
            className="form-control"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
          </select>
        </div>

        <div>
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={handleResetFilters}
          >
            Reset
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
          <p>Fetching parking slots...</p>
        </div>
      ) : filteredSpaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h4 className="empty-title">No Parking Spaces Found</h4>
          <p className="empty-desc">
            No spaces match your selected filters. Try broadening your search or resetting the filters.
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredSpaces.map((space) => (
            <ParkingCard
              key={space.id}
              space={space}
              onReserve={(sp) => setSelectedSpace(sp)}
            />
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      {selectedSpace && (
        <ReservationForm
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onSuccess={handleReserveSuccess}
        />
      )}
    </div>
  );
}

export default Parking;
