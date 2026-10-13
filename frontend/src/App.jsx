import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Parking from './pages/Parking';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';
import ManageParking from './pages/ManageParking';
import ManageReservations from './pages/ManageReservations';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/parking" element={<ManageParking />} />
            <Route path="/admin/reservations" element={<ManageReservations />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
