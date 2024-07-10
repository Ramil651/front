import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Импорт стилей для AdminPanel.css

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lectures, setLectures] = useState([]);
  const [practices, setPractices] = useState([]);
  const [duration, setDuration] = useState(''); // Новое состояние для длительности
  const [category, setCategory] = useState(''); // Новое состояние для категории
  const [startDate, setStartDate] = useState(''); // Новое состояние для даты начала
  const [endDate, setEndDate] = useState(''); // Новое состояние для даты окончания

  // Функция для получения курсов
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses/list');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  // Вызов fetchCourses при загрузке компонента
  useEffect(() => {
    fetchCourses();
  }, []);

  const addLecture = () => {
    setLectures([...lectures, { title: '', content: '', files: [] }]);
  };

  const addPractice = () => {
    setPractices([...practices, { title: '', content: '', files: [] }]);
  };

  const handleLectureChange = (index, key, value) => {
    const newLectures = [...lectures];
    newLectures[index][key] = value;
    setLectures(newLectures);
  };

  const handlePracticeChange = (index, key, value) => {
    const newPractices = [...practices];
    newPractices[index][key] = value;
    setPractices(newPractices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const courseData = {
      name,
      description,
      lectures,
      practices,
      duration,    // Добавлено
      category,    // Добавлено
      startDate,   // Добавлено
      endDate      // Добавлено
    };
  
    try {
      if (editingCourse) {
        await axios.put(`http://localhost:5000/courses/${editingCourse._id}`, courseData);
        setEditingCourse(null);
      } else {
        await axios.post('http://localhost:5000/courses', courseData);
      }
      // Очищаем состояния после добавления/редактирования
      setName('');
      setDescription('');
      setLectures([]);
      setPractices([]);
      setDuration('');    // Очищаем поле длительности
      setCategory('');    // Очищаем поле категории
      setStartDate('');   // Очищаем поле даты начала
      setEndDate('');     // Очищаем поле даты окончания
      setShowAddForm(false);
      fetchCourses(); // Обновление списка курсов после добавления/редактирования
    } catch (error) {
      console.error('Error adding/updating course', error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setName(course.name);
    setDescription(course.description);
    setLectures(course.lectures);
    setPractices(course.practices);
    setDuration(course.duration);
    setCategory(course.category);
    setStartDate(course.startDate);
    setEndDate(course.endDate);
    setShowAddForm(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}`);
      fetchCourses(); // Обновление списка курсов после удаления
    } catch (error) {
      console.error('Error deleting course', error);
    }
  };

  return (
    <div className="admin-panel-container">
      <h1>Админ панель</h1>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Отмена' : 'Добавить курс'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название курса"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Описание курса"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Длительность курса"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Категория курса"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Дата начала курса"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Дата окончания курса"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <div className="materials">
            <h2>Лекции</h2>
            {lectures.map((lecture, index) => (
              <div key={index} className="material">
                <input
                  type="text"
                  placeholder="Заголовок"
                  value={lecture.title}
                  onChange={(e) => handleLectureChange(index, 'title', e.target.value)}
                  required
                />
                <textarea
                  placeholder="Контент"
                  value={lecture.content}
                  onChange={(e) => handleLectureChange(index, 'content', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Файлы (через запятую)"
                  value={lecture.files.join(', ')}
                  onChange={(e) => handleLectureChange(index, 'files', e.target.value.split(', '))}
                />
              </div>
            ))}
            <button type="button" onClick={addLecture}>Добавить лекцию</button>
          </div>
          <div className="materials">
            <h2>Практики</h2>
            {practices.map((practice, index) => (
              <div key={index} className="material">
                <input
                  type="text"
                  placeholder="Заголовок"
                  value={practice.title}
                  onChange={(e) => handlePracticeChange(index, 'title', e.target.value)}
                  required
                />
                <textarea
                  placeholder="Контент"
                  value={practice.content}
                  onChange={(e) => handlePracticeChange(index, 'content', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Файлы (через запятую)"
                  value={practice.files.join(', ')}
                  onChange={(e) => handlePracticeChange(index, 'files', e.target.value.split(', '))}
                />
              </div>
            ))}
            <button type="button" onClick={addPractice}>Добавить практику</button>
          </div>
          <button type="submit">{editingCourse ? 'Сохранить изменения' : 'Добавить курс'}</button>
        </form>
      )}

      <ul className="courses-list">
        {courses.map(course => (
          <li key={course._id} className="course-item">
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <p>Длительность: {course.duration}</p>
            <p>Категория: {course.category}</p>
            <p>Дата начала: {new Date(course.startDate).toLocaleDateString()}</p>
            <p>Дата окончания: {new Date(course.endDate).toLocaleDateString()}</p>
            <button onClick={() => handleEdit(course)}>Редактировать</button>
            <button onClick={() => handleDelete(course._id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
