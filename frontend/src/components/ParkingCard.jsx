import React from 'react';

function ParkingCard({ space, onReserve }) {
  const isAvailable = space.status === 'AVAILABLE';
  const vehicleIcon = space.vehicleType === 'BIKE' ? '🏍️' : '🚗';

  return (
    <div className={`parking-card ${isAvailable ? 'available-card' : 'occupied-card'}`}>
      <div className="parking-card-header">
        <div>
          <span className="space-number">{space.spaceNumber}</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            ID: #{space.id}
          </div>
        </div>
        <span className={`badge ${isAvailable ? 'badge-available' : 'badge-occupied'}`}>
          {space.status}
        </span>
      </div>

      <div className="parking-details">
        <div className="detail-item">
          <span>📍</span>
          <span>Location: <strong>{space.location}</strong></span>
        </div>
        <div className="detail-item">
          <span>{vehicleIcon}</span>
          <span>Vehicle Type: <strong>{space.vehicleType}</strong></span>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        {isAvailable ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => onReserve(space)}
            id={`reserve-btn-${space.id}`}
          >
            Reserve Now ⚡
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
            disabled
          >
            Occupied 🔒
          </button>
        )}
      </div>
    </div>
  );
}

export default ParkingCard;
