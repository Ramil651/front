import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isAuthenticated, handleLogout }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <h2>Kurs.zdes</h2>
        </div>
        <div className="nav-center">
          <ul className="nav-links">
            <li>
              <Link to="/">Домой</Link>
            </li>
            <li>
              <Link to="/courses">Курсы</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/my-courses">Мои курсы</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile">Профиль</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Выйти</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Вход</Link>
                </li>
                <li>
                  <Link to="/register">Регистрация</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
