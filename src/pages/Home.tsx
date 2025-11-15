// src/pages/Home.tsx

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1 className="users-page__title">Bienvenido a Monetix</h1>
      </div>

      <Card>
        <Card.Header>Dashboard</Card.Header>
        <Card.Body>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
            Hola, <strong>{user?.name}</strong>! 👋
          </p>
          <p>Esta es tu aplicación de gestión financiera con predicciones inteligentes.</p>
          
          {user?.role === 'admin' && (
            <div style={{ 
              marginTop: 'var(--spacing-lg)', 
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-hover)',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <p><strong>Panel de Administrador</strong></p>
              <p>Accede a las opciones de administración desde tu perfil en la esquina superior derecha.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;