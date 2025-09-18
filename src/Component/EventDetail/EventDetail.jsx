import React from "react";
import { useParams, useNavigate } from "react-router";
import "./EventDetail.scss";
import usePosts from "../../API/usePosts";
import Seo from "../../components/Seo/Seo";

const EventDetail = () => {
  const { data: news } = usePosts();
  const navigate = useNavigate();
  const { id } = useParams();
  const event = news?.find((item) => item.id.toString() === id);
  const canonicalPath = `/events/${id}`;

  if (!event) {
    return (
      <>
        <Seo
          title="Событие не найдено — Project Team"
          description="Запрошенное событие не найдено или было удалено."
          canonicalPath={canonicalPath}
          ogTitle="Событие не найдено"
          ogDescription="Событие недоступно."
          robots="noindex, nofollow"
        />
        <div className="errorHeader">Событие не найдено</div>
      </>
    );
  }

  const ogImage = event.preview_image || event.img || "/img/DefaultImage.webp";
  const descriptionSnippet =
    (event.content && event.content.replace(/<[^>]+>/g, "").slice(0, 160)) ||
    "Подробности события Project Team.";

  return (
    <>
      <Seo
        title={`${event.title} — Project Team`}
        description={descriptionSnippet}
        canonicalPath={canonicalPath}
        ogTitle={event.title}
        ogDescription={descriptionSnippet}
        ogImage={ogImage}
        ogImageAlt={event.title}
      />
      <section className="event-detail">
        <img src={event.img} alt={event.title} />
        <h1>{event.title}</h1>

        {event.preview_image && (
          <img src={event.preview_image} alt={event.title} />
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
      </section>
    </>
  );
};

export default EventDetail;
