
import './CertificatePage.css';
import React, { useEffect, useState } from 'react';

const CertificatePage = ({ courseId }) => {
  // Состояние для хранения данных пользователя
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Если пользователь не загружен, показываем загрузку или сообщение об ошибке
  if (!user) {
    return <p>Загрузка данных пользователя...</p>;
  }

  // Данные о пользователе из localStorage
  const { firstName, lastName } = user;

  // Ваша логика для скачивания сертификата
  const downloadCertificate = () => {
    // Ваша логика для скачивания сертификата
    console.log('Downloading certificate...');
  };

  return (
    <div className="certificate-container">
      <h2>Сертификат</h2>
      <p>ФИО: {firstName} {lastName}</p>
      <p>Курс: Тестовый курс</p> {/* Замените на реальные данные курса */}
      <p>Дата завершения: {new Date().toLocaleDateString()}</p> {/* Пример текущей даты, замените на реальную дату завершения */}
      <button onClick={downloadCertificate}>Скачать сертификат</button>
    </div>
  );
};

export default CertificatePage;
