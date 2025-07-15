import React from 'react';
import { MyContext } from '../App';
import LoadPers from '../Elements/Loading/loadingPerson';
import LoadMng from '../Elements/Loading/loadingEvent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Members = () => {
  const { topPerson, isloadingTop, manager , isloadingMng} = React.useContext(MyContext);

  const formatName = (fullName) => {
    const maxLength = 12;
    if (fullName.length <= maxLength) {
      return fullName;
    }

    const parts = fullName.split(' ');
    if (parts.length < 2) {
      return fullName;
    }

    const lastName = parts[0];
    const firstName = parts[1][0] + '.';
    const middleName = parts[2] ? parts[2][0] + '.' : '';

    return `${lastName} ${firstName} ${middleName}`.trim();
  };

  if (!topPerson) {
    return <div>Загрузка!!!</div>;
  }

  return (

    <div className='Members'>
      <div className='supervisor'>
        <h2>Руководители</h2>


        <ul className='cardSupervisor'>
        {isloadingMng ? (
          Array.from({ length: 3 }).map((_, index) => (
            <LoadMng key={index} width='400px' height='350px' />
          ))
        ) : (
          manager.map(item => (
            <li key={item.key}>
              <img src='img/kot.jpg' alt='top' />
              <h4>{item.first_name}</h4>
              { item.status === "главный админ" ? <p>Руководитель проектной команды</p> : <p>Секретарь</p> }
            </li>
          ))
        )}
      </ul>
 
      <Swiper
      className='mobSlaidMemb'
      modules={[Navigation]}
      spaceBetween={10}
      slidesPerView={1}
      navigation={true}
      >
        {isloadingMng ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <SwiperSlide key={index}>
                              Загрузка...
                            </SwiperSlide>
                        ))
                        ) : (
                        manager.map((item, index) => (
                        <SwiperSlide key={item.key || index}>
                          <div className="card_manager">
                            <img src="img/kot.jpg" alt={item.first_name} />
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
      <div className='rating'>
        <h2>Лидеры рейтинга</h2>
        <ul>
          {isloadingTop ? (
            Array.from({ length: 10 }).map((_, index) => (
              <li
                className={`cardRating ${index >= 3 ? 'cardWithButton' : ''}`}
                key={index}
              >
                <LoadPers
                  width={index < 3 ? '300px' : '400px'} 
                  height='150px' 
                />
              </li>
            ))
          ) : (
            topPerson.map((item, index) => (
              <li
                className={`cardRating ${index >= 3 ? 'cardWithButton' : ''}`}
                key={index}
              >
                {index === 0 && (
                  <img src='/img/crown.png' className='KingTop' alt='Корона' />
                )}
                <img className='imgRating' alt='' src='img/kot.jpg' />
                <div className='textCard'>
                  <p className='positionRating'>
                    <b>{item.position}</b>st
                  </p>
                  <div className='textInfo'>
                    <p className='textName'>
                      {index < 3 ? formatName(item.first_name) : item.first_name}
                    </p>
                    <p className='textGroup'>ПИ-22-1</p>
                  </div>
                  <span className='numRating'>{item.rating}</span>
                  {/* {index >= 3 && (
                    <button className='detailsButton'>Подробнее</button>
                  )} */}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Members;