import React, { useState } from 'react';
import { createReservation } from '../services/api';

function ReservationForm({ space, onClose, onSuccess }) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    userType: 'STUDENT',
    vehicleNumber: '',
    reservationDate: today,
    startTime: '09:00',
    endTime: '11:00',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.vehicleNumber.trim()) {
      setError('Please provide your vehicle number.');
      return;
    }
    if (!formData.reservationDate) {
      setError('Please select a reservation date.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Start time and End time are required.');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setError('Start time must be strictly before End time.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        parkingSpaceId: space.id,
        name: formData.name.trim(),
        userType: formData.userType,
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        vehicleType: space.vehicleType,
        reservationDate: formData.reservationDate,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      };

      const res = await createReservation(payload);
      setSuccessInfo(res);
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            Reserve Space <span style={{ color: 'var(--primary-accent)' }}>{space?.spaceNumber}</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {successInfo ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h4 style={{ fontSize: '1.4rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
              Reservation Confirmed!
            </h4>
            <p style={{ marginBottom: '1.5rem' }}>
              Your reservation has been booked successfully.
            </p>
            <div
              style={{
                backgroundColor: 'var(--input-bg)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Reservation ID:</strong>{' '}
                <span style={{ color: 'var(--primary-accent)', fontWeight: '700' }}>#{successInfo.id}</span>
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Space Number:</strong> {space.spaceNumber} ({space.location})
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Vehicle:</strong> {successInfo.vehicleNumber} ({space.vehicleType})
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Time:</strong> {formData.reservationDate} ({formData.startTime} - {formData.endTime})
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1.25rem',
                    fontSize: '0.9rem',
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">User Type</label>
                  <select
                    name="userType"
                    className="form-control"
                    value={formData.userType}
                    onChange={handleChange}
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="FACULTY">FACULTY</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={space.vehicleType}
                    disabled
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  className="form-control"
                  placeholder="e.g. ABC-1234 or KA-01-AB-1234"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reservation Date</label>
                <input
                  type="date"
                  name="reservationDate"
                  className="form-control"
                  min={today}
                  value={formData.reservationDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    className="form-control"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    className="form-control"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                id="submit-reservation-btn"
              >
                {loading ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationForm;
