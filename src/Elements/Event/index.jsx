import { useNavigate } from 'react-router';
import style from './Event.module.scss';

const Event = ({ id, image, description, contMyEvent, homeEvent }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  const truncateDescription = (text, wordLimit = 8) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <article 
      className={`${style.swiperSlide} ${contMyEvent} ${homeEvent}`} 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={image === null ? image : '/img/DefaultImage.png'}
        alt="Slide 1"
        className={style.SliderImg}
      />
      <div className={style.textOverlay}>
        <p>{truncateDescription(description)}</p>
      </div>
    </article>
  );
};

export default Event;
