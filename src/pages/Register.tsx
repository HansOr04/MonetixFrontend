// src/pages/Register.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/auth.service';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Registrar
      await authService.register({
        ...formData,
        role: 'user'
      });

      // Auto-login después del registro
      await login({
        email: formData.email,
        password: formData.password
      });

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img
            src="/piggy-bank.png"
            alt="Monetix"
            className="auth-logo__image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="auth-logo__title">MONETIX</h1>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">REGISTRO</h2>
            <p className="auth-card__subtitle">USUARIO</p>
          </div>

          <div className="auth-card__body">
            <form onSubmit={handleSubmit} className="form">
              {error && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(216, 124, 124, 0.1)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-error)',
                    textAlign: 'center'
                  }}
                >
                  {error}
                </div>
              )}

              <Input
                type="text"
                name="name"
                label="NOMBRE"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                type="email"
                name="email"
                label="EMAIL"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                label="PASSWORD"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'CREANDO CUENTA...' : 'CREAR'}
              </Button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="form-link">
                Regresar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;