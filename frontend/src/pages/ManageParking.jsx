import React, { useEffect, useState } from 'react';
import {
  getAllParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
} from '../services/api';
import { useToast } from '../context/ToastContext';

function ManageParking() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [formData, setFormData] = useState({
    spaceNumber: '',
    location: 'Block A',
    vehicleType: 'CAR',
    status: 'AVAILABLE',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation dialog state
  const [deletingSpace, setDeletingSpace] = useState(null);

  const { addToast } = useToast();

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllParkingSpaces();
      setSpaces(data);
    } catch (err) {
      console.error(err);
      setError('Could not load parking spaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const openAddModal = () => {
    setEditingSpace(null);
    setFormData({
      spaceNumber: '',
      location: 'Block A',
      vehicleType: 'CAR',
      status: 'AVAILABLE',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (space) => {
    setEditingSpace(space);
    setFormData({
      spaceNumber: space.spaceNumber,
      location: space.location,
      vehicleType: space.vehicleType,
      status: space.status,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.spaceNumber.trim()) {
      addToast('Please enter a space number.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingSpace) {
        await updateParkingSpace(editingSpace.id, formData);
        addToast(`Space ${formData.spaceNumber} updated successfully.`, 'success');
      } else {
        await createParkingSpace(formData);
        addToast(`Space ${formData.spaceNumber} added successfully.`, 'success');
      }
      setIsModalOpen(false);
      fetchSpaces();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error saving parking space.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSpace) return;
    try {
      await deleteParkingSpace(deletingSpace.id);
      addToast(`Space ${deletingSpace.spaceNumber} deleted.`, 'success');
      setDeletingSpace(null);
      fetchSpaces();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Cannot delete space with active reservations.', 'error');
      setDeletingSpace(null);
    }
  };

  return (
    <div className="manage-parking-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Parking Spaces</h1>
          <p className="page-subtitle">Configure slots, locations, and vehicle availability</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} id="add-space-btn">
          ➕ Add New Space
        </button>
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
          <p>Loading spaces...</p>
        </div>
      ) : spaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🅿️</div>
          <h4 className="empty-title">No Parking Spaces Found</h4>
          <p className="empty-desc">Click "Add New Space" above to set up your first parking spot.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Space Number</th>
                <th>Location</th>
                <th>Vehicle Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {spaces.map((sp) => (
                <tr key={sp.id}>
                  <td><strong>#{sp.id}</strong></td>
                  <td><strong>{sp.spaceNumber}</strong></td>
                  <td>{sp.location}</td>
                  <td>
                    <span>{sp.vehicleType === 'BIKE' ? '🏍️' : '🚗'} </span>
                    {sp.vehicleType}
                  </td>
                  <td>
                    <span className={`badge ${sp.status === 'AVAILABLE' ? 'badge-available' : 'badge-occupied'}`}>
                      {sp.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(sp)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeletingSpace(sp)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingSpace ? `Edit Space ${editingSpace.spaceNumber}` : 'Add New Parking Space'}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Space Number</label>
                  <input
                    type="text"
                    name="spaceNumber"
                    className="form-control"
                    placeholder="e.g. A-101, B-205"
                    value={formData.spaceNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location Block</label>
                  <select
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleFormChange}
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    className="form-control"
                    value={formData.vehicleType}
                    onChange={handleFormChange}
                  >
                    <option value="CAR">Car</option>
                    <option value="BIKE">Bike</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingSpace ? 'Update Space' : 'Create Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingSpace && (
        <div className="modal-overlay" onClick={() => setDeletingSpace(null)}>
          <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Delete Space</h3>
            <p className="confirm-text">
              Are you sure you want to delete parking space{' '}
              <strong>{deletingSpace.spaceNumber}</strong>? If this space has active bookings, the deletion will be rejected.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingSpace(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageParking;
