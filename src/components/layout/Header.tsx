// src/components/layout/Header.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link to="/" className="header__logo">
            <img
              src="/logo-monetix.png"
              alt="Monetix"
              className="header__logo-image"
              onError={(e) => {
                // Fallback si la imagen no existe
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          <nav className="header__nav">
            <Link to="/" className={`header__nav-link ${isActive('/')}`}>
              Inicio
            </Link>
            <Link to="/predictions" className={`header__nav-link ${isActive('/predictions')}`}>
              Predicciones
            </Link>
            <Link to="/comparatives" className={`header__nav-link ${isActive('/comparatives')}`}>
              Comparativas
            </Link>
            <Link to="/goals" className={`header__nav-link ${isActive('/goals')}`}>
              Mis Metas
            </Link>
          </nav>
        </div>

        <div className="header__right">
          <div className="header__user" ref={dropdownRef}>
            <button
              className="header__user-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="header__user-icon">{user ? getInitials(user.name) : 'U'}</div>
              <span className="header__user-name">
                Hi, {user?.name.split(' ')[0] || 'Usuario'}!
              </span>
            </button>

            <div className={`header__dropdown ${dropdownOpen ? 'active' : ''}`}>
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/users"
                    className="header__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    👥 Gestionar Usuarios
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="header__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📁 Gestionar Categorías
                  </Link>
                  <Link
                    to="/admin/config"
                    className="header__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    ⚙️ Configuración
                  </Link>
                  <div
                    style={{
                      borderTop: '2px solid var(--color-border)',
                      margin: 'var(--spacing-sm) 0'
                    }}
                  />
                </>
              )}
              <Link
                to="/profile"
                className="header__dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                👤 Mi Perfil
              </Link>
              <button className="header__dropdown-item danger" onClick={handleLogout}>
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;