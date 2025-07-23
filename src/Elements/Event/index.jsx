import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Event.module.scss';

const Event = ({ id, image, title, contMyEvent, homeEvent }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  return (
    <div 
      className={`${style.swiperSlide} ${contMyEvent} ${homeEvent}`} 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={image ? image : '/img/image2.png'}
        alt="Slide 1"
        className={style.SliderImg}
      />
      <div className={style.textOverlay}>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Event;