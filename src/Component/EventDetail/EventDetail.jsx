import React from "react";
import { useParams,useNavigate } from "react-router-dom";
import "./EventDetail.scss";

const EventDetail = ({ events }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = events.find(event => event.id.toString() === id);

  if (!event) {
    return <div>Событие не найдено</div>;
  }

  return (
    <div className="event-detail">
      <img src={event.img} alt={event.title} />
      <h1>{event.title}</h1>

      {event.preview_image && (
        <img src={event.preview_image} alt={event.title}/>
      )}


      <div className="event-section content">
        <p>{event.content}</p>
      </div>

      <p className="event-meta">
        Дата:{" "}
        {new Date(event.date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>

      <p className="event-meta">Статус: {event.status}</p>
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default EventDetail;
