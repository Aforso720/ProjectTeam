import React from 'react';
import './Home.scss'
import Banner from '../../Elements/Banner';
import Card from '../../Elements/Card/index';
import Slider from '../../Elements/Slider';
import {MyContext} from '../../App';
import usePosts from '../../API/usePosts';
import LoadingEvent from '../../Elements/Loading/loadingEvent'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
    const [isActive, setIsActive] = React.useState('Новости');
    const [category, setCategory] = React.useState('Новости');
    const { events: eventCategory} = usePosts(category);
    const {userActive} = React.useContext(MyContext)

    const {homePerson , isloadingPersHome} = React.useContext(MyContext);
    const { events , loading : loadingBan } = usePosts();
    const {manager, isloadingMng} = React.useContext(MyContext);


    const handleClick = (category) => {
        setIsActive(category);
        setCategory(category);
    };

    function sortManager(managerList) {
        const admins = managerList.filter(m => m.status === "главный админ");
        const others = managerList.filter(m => m.status !== "главный админ");
        return [...admins, ...others]; 
      }
      

    return (
        <div className='Home'>
            <div className='Banner'>
                {loadingBan ? <LoadingEvent width="1000px" height="40vh"/> : <Banner news={events}/>}
            </div>
           <div className='Events'>
                <ul className='stateEvents'>
                    <li
                        className={`stateEvent ${isActive === 'Новости' ? 'active' : ''}`}
                        onClick={() => handleClick('Новости')}
                    >
                        <span>Новости</span>
                    </li>
                    {userActive ? (
                        <li
                            className={`stateEvent ${isActive === 'Мои конкурсы' ? 'active' : ''}`}
                            onClick={() => handleClick('Мои конкурсы')}
                        >
                            <span>Мои конкурсы</span>
                        </li>
                    ) : null}
                    <li
                        className={`stateEvent ${isActive === 'Активные конкурсы' ? 'active' : ''}`}
                        onClick={() => handleClick('Активные конкурсы')}
                    >
                        <span>Активные конкурсы</span>
                    </li>
                    <li
                        className={`stateEvent ${isActive === 'Завершенные конкурсы' ? 'active' : ''}`}
                        onClick={() => handleClick('Завершенные конкурсы')}
                    >
                        <span>Завершенные конкурсы</span>
                    </li>
                </ul>
                
                <div className='sliderHome'>
                    <Slider eventCategory={eventCategory}/>
                </div>
            </div>

            <div className='TopT'>
                <h2>Лидеры рейтинга</h2>
                <ul className='CardTop'>
                {isloadingPersHome ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <li key={index}>
                            <LoadingEvent width="450px" height="550px"/>
                        </li>
                    ))
                ) : (
                    homePerson.map((person, index) => (
                        <li key={index}>
                            <Card
                                {...person}
                                extraClass={person.position === 1 ? "WinnerCard" : ''}
                            />
                            {person.position === 1 && (
                                <img src='/img/crown.png' className='KingTop' alt='Корона' />
                            )}
                        </li>
                    ))
                )}
                </ul>
            </div>
            
            <div className='aboutHome'>
                <div className='contentAbout'>
                    <div className='textAbout'>
                        <h3>О нас</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <img src='img/image 6.png' className='imgAbout' alt='' />
                </div>
            </div>
            <div className='manager'>
            <h2>Руководители</h2>

                {/* Desktop version */}
                <ul className="manager__list">
                {isloadingMng ? (
                    Array.from({ length: 3 }).map((_, index) => (
                    <li key={index}>
                        <LoadingEvent width="350px" height="250px" />
                    </li>
                    ))
                ) : (
                    manager.map(item => (
                    <li key={item.key}>
                        <div className="card_manager">
                        <img src="img/kot.jpg" alt="" />
                        <h4>{item.first_name}</h4>
                        {item.status === 'главный админ' ? (
                            <p>Руководитель проектной команды</p>
                        ) : (
                            <p>Секретарь</p>
                        )}
                        </div>
                    </li>
                    ))
                )}
                </ul>

                {/* Mobile version — Swiper */}
                <div className="manager__slider">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation={true}
                    >
                        {isloadingMng ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <SwiperSlide key={index}>
                            <LoadingEvent width="350px" height="250px" />
                            </SwiperSlide>
                        ))
                        ) : (
                        sortManager(manager).map((item, index) => (
                            <SwiperSlide key={item.key || index}>
                            <div className="card_manager">
                                <img src="img/kot.jpg" alt="" />
                                <h4>{item.first_name}</h4>
                                {item.status === 'главный админ' ? (
                                <p>Руководитель проектной команды</p>
                                ) : (
                                <p>Секретарь</p>
                                )}
                            </div>
                            </SwiperSlide>
                        ))
                        )}
                    </Swiper>
                    </div>
                </div>
        </div>
    );
};

export default Home;