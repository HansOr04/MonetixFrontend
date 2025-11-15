// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { validateEmail, validatePassword } from '@/utils/validators';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de errores
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Validar campo individual
  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error);
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setPasswordError(error);
  };

  // Limpiar error al escribir
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (apiError) setApiError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // Si hay errores, no continuar
    if (emailErr || passwordErr) {
      return;
    }

    setApiError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Error al iniciar sesión');
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
            <form onSubmit={handleSubmit} className="form" noValidate>
              {apiError && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(216, 124, 124, 0.1)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-error)',
                    textAlign: 'center'
                  }}
                >
                  {apiError}
                </div>
              )}

              <Input
                type="email"
                label="USUARIO"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={emailError}
              />

              <Input
                type="password"
                label="CONTRASEÑA"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={passwordError}
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