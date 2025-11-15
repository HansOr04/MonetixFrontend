// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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
            <h2 className="auth-card__title">INICIAR SESIÓN</h2>
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
                type="email"
                label="USUARIO"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="CONTRASEÑA"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'INICIANDO...' : 'INICIAR'}
              </Button>
            </form>

            <div className="auth-footer">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="form-link">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;