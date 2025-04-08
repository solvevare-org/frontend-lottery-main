import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import UserTicketPurchase from './components/user/UserTicketPurchase';
import LuckyDraw from './components/admin/LuckyDraw';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AdminProvider } from './contexts/AdminContext';
import { TicketProvider } from './contexts/TicketContext';
import HomePage from './components/common/HomePage';
import AdminSignup from './components/admin/AdminSignup';

function App() {
  return (
    <AdminProvider>
      <TicketProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/buy-ticket" element={<UserTicketPurchase />} />
                {/* Protected Route */}
        <Route
          path="/admin/lucky-draw"
          element={
            <ProtectedRoute>
              <LuckyDraw />
            </ProtectedRoute>
          }
        />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/lucky-draw" 
                element={
                  <ProtectedRoute>
                    <LuckyDraw />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </div>
      </TicketProvider>
    </AdminProvider>
  );
}

export default App;
