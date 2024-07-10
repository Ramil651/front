import React, { useState } from 'react';
import axios from 'axios';
import './CourseList.css'; // Импорт стилей из CourseList.css

const Enroll = ({ courseId, isEnrolled, onEnrollmentChange }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const enrollInCourse = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/enrollment/getcours',
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onEnrollmentChange(courseId, true);
    } catch (error) {
      console.error('Error enrolling in course', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEnrollment = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/enrollment/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onEnrollmentChange(courseId, false);
    } catch (error) {
      console.error('Error canceling enrollment', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isEnrolled ? (
        <button className="enrolled-button" onClick={cancelEnrollment} disabled={loading}>
          {loading ? 'Отмена...' : 'Отменить зачисление'}
        </button>
      ) : (
        <button className="enroll-button" onClick={enrollInCourse} disabled={loading}>
          {loading ? 'Запись...' : 'Записаться на курс'}
        </button>
      )}
    </div>
  );
};

export default Enroll;
