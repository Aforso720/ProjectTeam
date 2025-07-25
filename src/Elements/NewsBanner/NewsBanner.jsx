import React from 'react'
import './NewsBanner.scss'
import { useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';

const NewsBanner = () => {
  const { id } = useParams();
  const { events } = React.useContext(MyContext);
  console.log(events)
  const navigate = useNavigate();
  const newsItem = events?.find(item => item.id === parseInt(id));

  if (!newsItem) {
    return <div>Новость не найдена</div>;
  }

  return (
    <div className="news-detail">
      <h1>{newsItem.title}</h1>
      <p>{newsItem.content}</p>
      <p>Дата публикации: {new Date(newsItem.date).toLocaleDateString()}</p>
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
}

export default NewsBanner;
