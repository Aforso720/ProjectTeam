import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import axiosInstance from "../../API/axiosInstance";
import { normalizeImageUrl } from "../imageUtils";
import { InviteProjectButton } from "../../components/ProjectInvites";

const InfoModalProject = ({ project, isOpen, onRequestClose }) => {
  const [participants, setParticipants] = React.useState([]);
  const [isLoadingParticipants, setIsLoadingParticipants] =
    React.useState(false);
  const [certificateUrl, setCertificateUrl] = React.useState("");
  const customStyles = {
    content: {
      // вместо top/left/transform используем центрирование через overlay
      inset: "unset",
      width: "min(92vw, 720px)",
      maxHeight: "88vh", // <— ограничиваем высоту
      padding: 0,
      borderRadius: "16px",
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      overflow: "auto",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
      display: "grid", // <— центрирование окна
      placeItems: "center",
      padding: "16px", // чтобы окно не прилипало к краям
      backdropFilter: "blur(2px)",
    },
  };

  const hasParticipantsIds =
    Array.isArray(project?.participants) && project.participants.length > 0;

  React.useEffect(() => {
    if (!project) return;
    if (project.certificate) {
      setCertificateUrl(normalizeImageUrl(project.certificate));
    } else {
      setCertificateUrl("");
    }
  }, [project]);

  React.useEffect(() => {
    if (!isOpen || !hasParticipantsIds) return;
    fetchParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, project?.participants]);

  const fetchParticipants = async () => {
    setIsLoadingParticipants(true);
    try {
      const requests = project.participants.map((participantId) =>
        axiosInstance.get(`/users/${participantId}`)
      );

      const responses = await Promise.allSettled(requests);

      // ВАЖНО: API возвращает { data: { ...user } }, поэтому берём data.data
      const users = responses
        .filter((r) => r.status === "fulfilled")
        .map((r) => {
          const body = r.value?.data;
          return body?.data ?? body ?? null;
        })
        .filter(Boolean);

      setParticipants(users);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setParticipants([]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "Не указана";
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      completed: "Завершен",
      in_progress: "В процессе",
      planned: "Запланирован",
      draft: "Черновик",
    };
    return statusMap[status] || status || "—";
  };

  const getDisplayName = (u) => {
    const fio = [u?.first_name, u?.middle_name, u?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    return u?.name || fio || u?.email || "Без имени";
  };

  const getInitials = (u) => {
    const base = getDisplayName(u);
    const parts = base.split(" ").filter(Boolean).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  };

  const getAvatarSrc = (u) => (u?.avatar ? normalizeImageUrl(u.avatar) : null);

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
      shouldCloseOnOverlayClick
      contentLabel="Информация о проекте"
    >
      <div className={style.Modal}>
        {/* Header */}
        <div className={style.modalHeader}>
          <h2>Информация о проекте</h2>
          <button
            className={style.closeButton}
            onClick={onRequestClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className={style.section}>
          {/* Превью */}
          {project.preview_image ? (
            <div className={style.projectImageSection}>
              <img
                src={normalizeImageUrl(project.preview_image)}
                alt="Превью проекта"
                className={style.projectPreviewImage}
                onError={(e) => {
                  e.currentTarget.src = "/img/DefaultImage.webp";
                }}
              />
            </div>
          ) : (
            <div className={style.projectImageFallback}>
              <span>Нет изображения</span>
            </div>
          )}

          {/* Название + статус */}
          <div className={style.projectTitleRow}>
            <h3 className={style.projectName}>{project.name}</h3>
            <span
              className={`${style.statusBadge} ${
                project.status
                  ? style[`status_${project.status}`] || style.status_default
                  : style.status_default
              }`}
              title={`Статус: ${getStatusText(project.status)}`}
            >
              {getStatusText(project.status)}
            </span>
          </div>

          {/* Описание */}
          <div className={style.projectDescription}>
            <h4>Описание</h4>
            <p className={style.lineClamp}>
              {project.description || "Описание отсутствует"}
            </p>
          </div>

          {/* Детали (без создан/обновлён) */}
          <div className={style.projectDetails}>
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата начала:</span>
              <span className={style.detailValue}>
                {formatDate(project.start_date)}
              </span>
            </div>

            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата окончания:</span>
              <span className={style.detailValue}>
                {formatDate(project.end_date)}
              </span>
            </div>

            <div className={style.detailRow}>
              <span className={style.detailLabel}>Подтвержден:</span>
              <span className={style.detailValue}>
                {project.is_approved ? "Да" : "Нет"}
              </span>
            </div>
          </div>

          {/* Сертификат */}
          {certificateUrl && (
            <div className={style.certificateSection}>
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={style.certificateLink}
              >
                📄 Посмотреть сертификат
              </a>
            </div>
          )}

          {/* Участники */}
          <div className={style.participantsSection}>
            <h4>Участники ({participants.length || 0})</h4>

            {isLoadingParticipants ? (
              <div className={style.participantsList}>
                <div className={style.skeletonRow} />
                <div className={style.skeletonRow} />
                <div className={style.skeletonRow} />
              </div>
            ) : participants.length > 0 ? (
              <div className={style.participantsList}>
                {participants.map((u) => {
                  const avatar = getAvatarSrc(u);
                  const initials = getInitials(u);
                  return (
                    <div
                      key={u.id || u.email}
                      className={style.participantItem}
                    >
                      <div className={style.avatar}>
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={getDisplayName(u)}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        ) : (
                          <span className={style.avatarFallback}>
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className={style.participantInfo}>
                        <div className={style.participantTopRow}>
                          <span className={style.participantName}>
                            {getDisplayName(u)}
                          </span>
                          {u.group ? (
                            <span className={style.groupChip}>{u.group}</span>
                          ) : null}
                        </div>
                        {u.email ? (
                          <div className={style.participantEmail}>
                            {u.email}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={style.noParticipants}>Участники не найдены</div>
            )}
          </div>
        </div>

        {/* Действия */}
        <div className={style.section}>
          <div className={style.buttonsMyDocum}>
            <InviteProjectButton
              projectId={project.id}
              projectName={project.name}
            />
            <button className={style.secondaryButton} onClick={onRequestClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModalProject;
