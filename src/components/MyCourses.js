import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/enrollment/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Получаем сохраненные значения прогресса из localStorage
        const localStorageProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');

        // Обновляем курсы с учетом сохраненного прогресса
        const updatedCourses = response.data.map(course => {
          const progressPercentageKey = `courseProgressPercentage_${course._id}`;
          const progressPercentage = localStorage.getItem(progressPercentageKey) || 0;

          return {
            ...course,
            progressPercentage: progressPercentage
          };
        });

        setCourses(updatedCourses);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Вы еще не записались на курс');
        } else {
          setError('Ошибка при получении курсов');
        }
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    } else {
      setError('Нет токена');
      setLoading(false);
    }
  }, [token]);

  const handleStartCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleGetCertificate = (courseId, courseName) => {
    // Открываем новую вкладку с сертификатом
    const certificateUrl = `/certificate/${courseId}`;
    window.open(certificateUrl, '_blank');
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="courses-container">
      {courses.length > 0 ? (
        courses.map(course => (
          <div key={course._id.toString()} className="course-card">
            <h2 className="course-title">{course.name}</h2>
            <p className="course-description">{course.description}</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${course.progressPercentage}%` }}>
                {course.progressPercentage}%
              </div>
            </div>
            <div className="button-container">
              {course.progressPercentage >= 100 ? (
                <button className="get-certificate-button" onClick={() => handleGetCertificate(course._id, course.name)}>Получить сертификат</button>
              ) : (
                <button className="start-course-button" onClick={() => handleStartCourse(course._id)}>Начать курс</button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Вы еще не записались на курс</p>
      )}
    </div>
  );
};

export default MyCourses;
