import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header>
        <h1>Добро пожаловать на наш сервис курсов</h1>
      </header>
      <main>
        <section className="about">
          <h2>О нас</h2>
          <p>Здесь вы можете найти широкий выбор курсов по различным темам...</p>
        </section>
        <section className="offers">
          <h2>Предложения курсов</h2>
          <p>Специальные предложения и акции наших курсов...</p>
        </section>
      </main>
      <footer>
        <p>Контактная информация и ссылки на социальные сети</p>
      </footer>
    </div>
  );
};

export default HomePage;
