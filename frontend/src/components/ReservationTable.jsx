import React, { useState } from 'react';

function ReservationTable({ reservations = [], onCancel, showActions = true }) {
  const [confirmDialog, setConfirmDialog] = useState(null);

  if (!reservations || reservations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h4 className="empty-title">No Reservations Found</h4>
        <p className="empty-desc">There are no reservation records to display.</p>
      </div>
    );
  }

  const getBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'CANCELLED':
        return 'badge-cancelled';
      case 'COMPLETED':
        return 'badge-completed';
      default:
        return 'badge-active';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
  };

  const handleCancelClick = (reservation) => {
    setConfirmDialog(reservation);
  };

  const handleConfirmCancel = () => {
    if (confirmDialog && onCancel) {
      onCancel(confirmDialog.id);
    }
    setConfirmDialog(null);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vehicle No</th>
              <th>Space</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const spaceNumber = res.parkingSpace?.spaceNumber || res.spaceNumber || `Space #${res.parkingSpaceId || ''}`;
              const location = res.parkingSpace?.location || res.location || 'N/A';
              const timeDisplay = `${formatTime(res.startTime)} - ${formatTime(res.endTime)}`;

              return (
                <tr key={res.id}>
                  <td><strong>#{res.id}</strong></td>
                  <td>{res.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({res.userType})</span></td>
                  <td>
                    <code>{res.vehicleNumber}</code>
                    <span style={{ marginLeft: '0.4rem', fontSize: '0.85rem' }}>
                      {res.vehicleType === 'BIKE' ? '🏍️' : '🚗'}
                    </span>
                  </td>
                  <td><strong>{spaceNumber}</strong></td>
                  <td>{location}</td>
                  <td>{res.reservationDate}</td>
                  <td>{timeDisplay}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  {showActions && (
                    <td>
                      {res.status === 'ACTIVE' && onCancel ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelClick(res)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Styled Confirmation Dialog */}
      {confirmDialog && (
        <div className="modal-overlay" onClick={() => setConfirmDialog(null)}>
          <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Cancel Reservation</h3>
            <p className="confirm-text">
              Are you sure you want to cancel reservation <strong>#{confirmDialog.id}</strong> for vehicle{' '}
              <strong>{confirmDialog.vehicleNumber}</strong>? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDialog(null)}
              >
                No, Keep It
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationTable;
