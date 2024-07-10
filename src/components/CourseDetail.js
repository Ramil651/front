import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getToken } from '../services/authService';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [progressPercentage, setProgressPercentage] = useState(0); // Используем локальный state для progressPercentage
  const token = getToken();

  // Функция для загрузки курса
  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details', error);
    }
  };

  // Функция для загрузки прогресса
  const fetchProgress = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data);

      // Вычисляем прогресс в процентах и сохраняем в localStorage
      const totalMaterials = course.lectures.length + course.practices.length;
      const completedMaterials = Object.keys(response.data).filter(materialId => response.data[materialId]).length;
      const calculatedProgressPercentage = Math.min(Math.round((completedMaterials / totalMaterials) * 100), 100);
      localStorage.setItem(`courseProgress_${id}`, JSON.stringify(response.data));
      localStorage.setItem(`courseProgressPercentage_${id}`, calculatedProgressPercentage);
      setProgressPercentage(calculatedProgressPercentage); // Устанавливаем progressPercentage в локальный state

    } catch (error) {
      console.error('Error fetching course progress', error);
    }
  };

  // Обработчик завершения материала
  const handleComplete = async (materialId) => {
    // Проверяем, завершено ли уже задание
    if (progress[materialId]) {
      console.warn('Это задание уже завершено.');
      return;
    }

    try {
      // Отправляем запрос на сервер для завершения задания
      await axios.post(`http://localhost:5000/courses/${id}/complete`, { materialId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Обновляем состояние прогресса локально
      const updatedProgress = { ...progress, [materialId]: true };
      setProgress(updatedProgress);

      // Вычисляем обновленный прогресс в процентах и сохраняем в localStorage
      const totalMaterials = course.lectures.length + course.practices.length;
      const completedMaterials = Object.keys(updatedProgress).filter(materialId => updatedProgress[materialId]).length;
      const updatedProgressPercentage = Math.min(Math.round((completedMaterials / totalMaterials) * 100), 100);
      localStorage.setItem(`courseProgress_${id}`, JSON.stringify(updatedProgress));
      localStorage.setItem(`courseProgressPercentage_${id}`, updatedProgressPercentage);
      setProgressPercentage(updatedProgressPercentage); // Устанавливаем progressPercentage в локальный state

    } catch (error) {
      console.error('Error marking material as complete', error);
    }
  };

  // Загрузка курса и прогресса при монтировании компонента
  useEffect(() => {
    fetchCourse();
    const storedProgress = JSON.parse(localStorage.getItem(`courseProgress_${id}`));
    const storedProgressPercentage = JSON.parse(localStorage.getItem(`courseProgressPercentage_${id}`));
    if (storedProgress) {
      setProgress(storedProgress);
      setProgressPercentage(storedProgressPercentage); // Устанавливаем progressPercentage в локальный state
    } else {
      fetchProgress();
    }
  }, [id, token]);

  // Если курс не загружен, показываем сообщение о загрузке
  if (!course) return <div>Загрузка...</div>;

  // Вычисление общего числа материалов
  const totalMaterials = course.lectures.length + course.practices.length;

  // Вычисление завершенных материалов на основе данных из состояния прогресса
  const completedMaterials = Object.keys(progress).filter(materialId => progress[materialId]).length;

  // Вычисление процента завершенности курса (ограничение до 100%)
  const calculatedProgressPercentage = Math.min(Math.round((completedMaterials / totalMaterials) * 100), 100);

  // Возвращаем разметку курса с информацией о прогрессе
  return (
    <div className="course-detail-container">
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <div className="course-materials">
        {course.lectures.concat(course.practices).map(material => (
          <div key={material._id} className="material">
            <h3>{material.title}</h3>
            <p>{material.content}</p>
            <button
              onClick={() => handleComplete(material._id)}
              disabled={progress[material._id]}
            >
              {progress[material._id] ? 'Завершено' : 'Завершить'}
            </button>
          </div>
        ))}
      </div>
      <div className="course-progress">
        Прогресс курса: {completedMaterials} из {totalMaterials} ({progressPercentage}%)
      </div>
    </div>
  );
};

export default CourseDetail;
