import React from 'react';
import Banner from '../Elements/Banner';
import Card from '../Elements/Card/index';
import Slaider from '../Elements/Slaider';
import { MyContext } from '../App';

const Home = () => {
  const [isActive, setIsActive] = React.useState('Новости'); // Устанавливаем начальное значение
  const { homePerson } = React.useContext(MyContext);

  const handleClick = (event) => {
    setIsActive(event);
  };

  return (
    <div className='Home'>
      <div className='Banner'>
        <Banner />
      </div>
      <div className='Events'>
        <ul className='stateEvents'>
          <li
            className={`stateEvent ${isActive === 'Новости' ? 'active' : ''}`}
            onClick={() => handleClick('Новости')}
          >
            Новости
          </li>
          <li
            className={`stateEvent ${isActive === 'Активные конкурсы' ? 'active' : ''}`}
            onClick={() => handleClick('Активные конкурсы')}
          >
            Активные конкурсы
          </li>
          <li
            className={`stateEvent ${isActive === 'Завершенные конкурсы' ? 'active' : ''}`}
            onClick={() => handleClick('Завершенные конкурсы')}
          >
            Завершенные конкурсы
          </li>
        </ul>
        <div className='sliderHome'>
          <Slaider />
        </div>
      </div>
      <div className='TopT'>
        <h2>Лидеры рейтинга</h2>
        <ul className='CardTop'>
          {homePerson.map((person, index) => (
            <li key={index}>
              <Card {...person} />
              {person.position === 1 && <img src='img/crown.png' className='KingTop' alt='Корона' />}
            </li>
          ))}
        </ul>
      </div>
      <div className='aboutHome'>
        <div className='contentAbout'>
          <div className='textAbout'>
            <h3>О нас</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <img src='img/image 4.svg' alt='' className='imgAbout' />
        </div>
      </div>
      <div className='Manajer'>
        <h2>Руководители</h2>
        <ul>
          <li>
            <div className='cardManajer'>
              <img src='img/Mask group.png' alt='' />
              <h4>Соло тащер</h4>
              <p>Секретарь</p>
            </div>
          </li>
          <li>
            <div className='cardManajer'>
              <img src='img/Mask group.png' alt='' />
              <h4>Соло тащер</h4>
              <p>Руководитель проектной команды</p>
            </div>
          </li>
          <li>
            <div className='cardManajer'>
              <img src='img/Mask group.png' alt='' />
              <h4>Соло тащер</h4>
              <p>Секретарь</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;