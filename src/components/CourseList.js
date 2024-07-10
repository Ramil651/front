import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Enroll from './Enroll';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [enrollments, setEnrollments] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(response.data);
      setFilteredCourses(response.data);
      fetchEnrollments(response.data); // Fetch enrollments after fetching courses
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  const fetchEnrollments = async (courses) => {
    try {
      const responses = await Promise.all(courses.map(course => 
        axios.get(`http://localhost:5000/enrollment/${course._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ));
      const enrollments = responses.reduce((acc, response, index) => {
        acc[courses[index]._id] = response.data.enrolled;
        return acc;
      }, {});
      setEnrollments(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments', error);
    }
  };

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, selectedStartDate, selectedEndDate]);

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedStartDate && selectedEndDate) {
      filtered = filtered.filter(course => {
        const courseStartDate = new Date(course.startDate);
        const courseEndDate = new Date(course.endDate);
        return (
          courseStartDate >= new Date(selectedStartDate) &&
          courseEndDate <= new Date(selectedEndDate)
        );
      });
    }

    setFilteredCourses(filtered);
  };

  const updateEnrollmentState = (courseId, enrolled) => {
    setEnrollments(prevEnrollments => ({
      ...prevEnrollments,
      [courseId]: enrolled
    }));
    fetchCourses(); // Update courses after enrollment state changes
  };

  return (
    <div className="container">
      <h1>Курсы</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="IT">IT</option>
          <option value="Бизнес">Бизнес</option>
          <option value="Маркетинг">Маркетинг</option>
          <option value="Другое">Другое</option>
        </select>
        <input
          type="date"
          placeholder="Дата начала"
          value={selectedStartDate}
          onChange={e => setSelectedStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Дата окончания"
          value={selectedEndDate}
          onChange={e => setSelectedEndDate(e.target.value)}
        />
      </div>
      <ul>
        {filteredCourses.map(course => (
          <li key={course._id}>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <p>Длительность: {course.duration}</p>
            <p>Категория: {course.category}</p>
            <p>Дата начала: {course.startDate}</p>
            <p>Дата окончания: {course.endDate}</p>
            <Enroll
              courseId={course._id}
              isEnrolled={enrollments[course._id]}
              onEnrollmentChange={updateEnrollmentState}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
