import React, { useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import "./NewsDetail.scss";
import usePosts from "../../API/usePosts";
import Seo from "../../components/Seo/Seo";

const stripTags = (html = "") => html.replace(/<[^>]+>/g, "");
const hasHtml = (s = "") => /<\/?[a-z][\s\S]*>/i.test(s);

const NewsDetail = () => {
  const { data: news } = usePosts();
  const navigate = useNavigate();
  const { id } = useParams();

  const event = news?.find((item) => item.id?.toString() === id);
  const canonicalPath = `/news/${id}`;

  const rawContent = event?.content ?? "";
  const ogImage = event?.preview_image || event?.img || "/img/DefaultImage.webp";

  const descriptionSnippet = event
    ? (rawContent && stripTags(rawContent).slice(0, 160)) ||
      "Подробности события Project Team."
    : "Запрошенное событие не найдено или было удалено.";

  const sanitizedHtml = useMemo(() => {
    if (!rawContent) return "";
    if (hasHtml(rawContent)) {
      return DOMPurify.sanitize(rawContent);
    }
    const escaped = rawContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return DOMPurify.sanitize(escaped.replace(/\n/g, "<br/>"));
  }, [rawContent]);

  const contentRef = useRef(null);
  useEffect(() => {
    if (!contentRef.current) return;
    const anchors = contentRef.current.querySelectorAll("a");
    anchors.forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }, [sanitizedHtml]);

  return (
    <>
      {event ? (
        <Seo
          title={`${event.title} — Project Team`}
          description={descriptionSnippet}
          canonicalPath={canonicalPath}
          ogTitle={event.title}
          ogDescription={descriptionSnippet}
          ogImage={ogImage}
          ogImageAlt={event.title}
        />
      ) : (
        <Seo
          title="Событие не найдено — Project Team"
          description={descriptionSnippet}
          canonicalPath={canonicalPath}
          ogTitle="Событие не найдено"
          ogDescription="Событие недоступно."
          robots="noindex, nofollow"
        />
      )}

      <section className="news-detail">
        {!event ? (
          <div className="errorHeader">Событие не найдено</div>
        ) : (
          <>
            {event.img && (
              <img
                src={event.img}
                alt={event.title}
                className="event-cover"
                loading="lazy"
              />
            )}

            <h1 className="eventMainPage">{event.title}</h1>

            {event.preview_image && (
              <img
                src={event.preview_image}
                alt={event.title}
                className="event-preview"
                loading="lazy"
              />
            )}

            <div className="event-section content">
              {sanitizedHtml ? (
                <div
                  ref={contentRef}
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              ) : (
                <p className="plain-text">Без описания</p>
              )}
            </div>

            {event.date && (
              <p className="event-meta">
                Дата:{" "}
                {new Date(event.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}

            {/* {event.status && <p className="event-meta">Статус: {event.status}</p>} */}

            <button onClick={() => navigate(-1)}>Назад</button>
          </>
        )}
      </section>
    </>
  );
};

export default NewsDetail;
