import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { getToken, saveUser, getUser } from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(getUser());
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const token = getToken();

  useEffect(() => {
    if (!user) {
      fetchUser(token);
    } else {
      setFormData(user);
    }
  }, [token, user]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      saveUser(response.data); // Сохраняем данные пользователя в localStorage
    } catch (error) {
      console.error('Ошибка при получении профиля пользователя', error);
      alert('Ошибка при получении профиля пользователя');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      saveUser(response.data); // Обновляем данные пользователя в localStorage
      setEditMode(false);
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении профиля', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Имя:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </label>
          <label>
            Фамилия:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} readOnly />
          </label>
          <label>
            Телефон:
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <label>
            Адрес:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditMode(false)}>Отмена</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
          <p className="profile-info">Email: {user.email}</p>
          <p className="profile-info">Телефон: {user.phone}</p>
          <p className="profile-info">Адрес: {user.address}</p>
          <button onClick={() => setEditMode(true)}>Редактировать профиль</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
