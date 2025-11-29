import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import "./ProjectDetail.scss";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../API/axiosInstance";
import useMyEvents from "../../API/useMyEvents";

const ruDate = (value) => {
  if (!value) return "—";
  try {
    const dt = new Date(value);
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(dt);
  } catch {
    return "—";
  }
};

const statusMap = {
  draft: { label: "Черновик", className: "status--draft" },
  active: { label: "Активный", className: "status--active" },
  in_progress: { label: "В работе", className: "status--active" },
  completed: { label: "Завершён", className: "status--completed" },
  archived: { label: "Архив", className: "status--archived" },
};

function StatusBadge({ status }) {
  const meta = statusMap[status] || { label: status ?? "Неизвестно", className: "status--unknown" };
  return <span className={`status ${meta.className}`}>{meta.label}</span>;
}

function ApprovedBadge({ approved }) {
  return (
    <span className={`approve ${approved ? "approve--yes" : "approve--no"}`}>
      {approved ? "Одобрен" : "На модерации"}
    </span>
  );
}

const ProjectDetail = () => {
  const { id } = useParams(); // /projects/:id
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const isOwner = useMemo(() => {
    if (!project || !user) return false;
    return Number(project.user_id) === Number(user.id);
  }, [project, user]);

  // 1) Загружаем проект
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await axiosInstance.get(`/projects/${id}`);
        const payload = res?.data?.data ?? res?.data ?? null;
        if (!ignore) setProject(payload);
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.message || "Не удалось загрузить проект");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  // 2) По ids участников подгружаем карточки пользователей
  useEffect(() => {
    let ignore = false;
    const loadMembers = async (ids = []) => {
      if (!ids.length) {
        if (!ignore) setMembers([]);
        return;
      }
      setMembersLoading(true);
      try {
        const requests = ids.map((uid) => axiosInstance.get(`/users/${uid}`).then(r => r?.data?.data ?? r?.data ?? null));
        const results = await Promise.allSettled(requests);
        const ok = results
          .map(r => (r.status === "fulfilled" ? r.value : null))
          .filter(Boolean);
        if (!ignore) setMembers(ok);
      } catch {
        if (!ignore) setMembers([]);
      } finally {
        if (!ignore) setMembersLoading(false);
      }
    };

    loadMembers(project?.participants || []);
    return () => { ignore = true; };
  }, [project?.participants]);

  if (loading) {
    return (
      <section className="ProjectDetail">
        <div className="toolbar">
          <button className="btn" onClick={() => navigate(-1)}>← Назад</button>
        </div>
        <div className="skeleton">
          <div className="skeleton__image" />
          <div className="skeleton__lines">
            <div className="line" />
            <div className="line" />
            <div className="line short" />
          </div>
        </div>
      </section>
    );
  }

  if (err || !project) {
    return (
      <section className="ProjectDetail">
        <div className="toolbar">
          <button className="btn" onClick={() => navigate(-1)}>← Назад</button>
        </div>
        <div className="error">
          <h3>Ошибка</h3>
          <p>{err || "Проект не найден."}</p>
        </div>
      </section>
    );
  }

  const {
    name,
    description,
    preview_image,
    certificate,
    status,
    start_date,
    end_date,
    is_approved,
  } = project;

  return (
    <section className="ProjectDetail">
      <div className="toolbar">
        <button className="btn" onClick={() => navigate(-1)}>← Назад</button>
        {isOwner && (
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            Редактировать
          </button>
        )}
      </div>

      <header className="header">
        <div className="header__badges">
          <StatusBadge status={status} />
          <ApprovedBadge approved={!!is_approved} />
        </div>
        <h1 className="title">{name}</h1>
      </header>

      <div className="grid">
        <div className="media">
          <img
            src={preview_image}
            alt={name}
          />
          {certificate && (
            <a className="btn btn--link" href={certificate} target="_blank" rel="noreferrer">
              📄 Открыть сертификат
            </a>
          )}
        </div>

        <div className="content">
          <section>
            <h2>Описание</h2>
            <p className="desc">{description || "—"}</p>
          </section>

          <section className="dates">
            <h3>Период</h3>
            <div className="dates__row">
              <div><span className="meta__label">Начало:</span> {ruDate(start_date)}</div>
              <div><span className="meta__label">Окончание:</span> {ruDate(end_date)}</div>
            </div>
          </section>

          <section className="participants">
            <h3>Участники {membersLoading ? "…" : `(${members.length})`}</h3>
            {membersLoading ? (
              <div className="participants__skeleton">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="pill skeleton-pill" />
                ))}
              </div>
            ) : members.length ? (
              <ul className="memberList">
                {members.map((m) => {
                  const fullName = [m?.last_name, m?.first_name].filter(Boolean).join(" ") || "Без имени";
                  return (
                    <li key={m.id} className="member">
                      <img
                        className="avatar"
                        src={m?.avatar}
                        alt={fullName}
                      />
                      <div className="member__info">
                        <div className="member__name">{fullName}</div>
                        <div className="member__group">{m?.group || "Группа не указана"}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted">Участников пока нет</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
