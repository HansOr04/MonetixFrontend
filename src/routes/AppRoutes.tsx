// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import PrivateRoute from './PrivateRoute';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Users from '@/pages/Users';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute adminOnly>
              <MainLayout>
                <Users />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Placeholder routes - implementar después */}
        <Route
          path="/predictions"
          element={
            <PrivateRoute>
              <MainLayout>
                <div className="users-page">
                  <h1 className="users-page__title">Predicciones</h1>
                  <p>Próximamente...</p>
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/comparatives"
          element={
            <PrivateRoute>
              <MainLayout>
                <div className="users-page">
                  <h1 className="users-page__title">Comparativas</h1>
                  <p>Próximamente...</p>
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <MainLayout>
                <div className="users-page">
                  <h1 className="users-page__title">Mis Metas</h1>
                  <p>Próximamente...</p>
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <PrivateRoute adminOnly>
              <MainLayout>
                <div className="users-page">
                  <h1 className="users-page__title">Gestión de Categorías</h1>
                  <p>Próximamente...</p>
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/config"
          element={
            <PrivateRoute adminOnly>
              <MainLayout>
                <div className="users-page">
                  <h1 className="users-page__title">Configuración</h1>
                  <p>Próximamente...</p>
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;