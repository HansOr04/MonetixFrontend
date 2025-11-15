// src/pages/Users.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import usersService from '@/services/users.service';
import { User } from '@/types/user.types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';

export const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });
  const [formError, setFormError] = useState('');

  // Verificar que sea admin
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { role: filter } : {};
      const { users: fetchedUsers } = await usersService.getAll(params);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalType('create');
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setFormError('');
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setModalType('edit');
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setFormError('');
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setFormError('');
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (modalType === 'create') {
        await usersService.create(formData);
      } else if (selectedUser) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        await usersService.update(selectedUser._id, updateData);
      }
      
      handleCloseModal();
      loadUsers();
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await usersService.delete(userId);
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  if (loading && users.length === 0) {
    return <Loader fullscreen />;
  }

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1 className="users-page__title">Gestión de Usuarios</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Nuevo Usuario
        </Button>
      </div>

      <div className="users-page__filters">
        <div className="form-group">
          <label className="form-label">Filtrar por rol</label>
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <Loader />
          ) : users.length === 0 ? (
            <div className="table-empty">No hay usuarios para mostrar</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`table-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn icon-btn-edit"
                            onClick={() => handleOpenEdit(user)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-btn icon-btn-delete"
                            onClick={() => handleDelete(user._id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Create/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalType === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
        footer={
          <>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {modalType === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form">
          {formError && (
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(216, 124, 124, 0.1)',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-error)'
              }}
            >
              {formError}
            </div>
          )}

          <Input
            type="text"
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {modalType === 'create' && (
            <Input
              type="password"
              label="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={modalType === 'create'}
              minLength={6}
            />
          )}

          <div className="form-group">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;