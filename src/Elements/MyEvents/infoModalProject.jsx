import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import axiosInstance from "../../API/axiosInstance";
import { InviteProjectButton } from "../../components/ProjectInvites";
import ConfirmModal from "../ConfirmModal.jsx";
import { AuthContext } from "../../context/AuthContext";

const InfoModalProject = ({
  project,
  isOpen,
  onRequestClose,
  onProjectUpdate,
  onProjectLeave,
}) => {
  const { user } = React.useContext(AuthContext);
  const [projectData, setProjectData] = React.useState(project ?? null);
  const [participants, setParticipants] = React.useState([]);
  const [isLoadingParticipants, setIsLoadingParticipants] =
    React.useState(false);
  const [certificateUrl, setCertificateUrl] = React.useState("");
  const [feedback, setFeedback] = React.useState({ error: "", success: "" });
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
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

  React.useEffect(() => {
    setProjectData(project ?? null);
  }, [project]);

  React.useEffect(() => {
    if (!isOpen) {
      setFeedback({ error: "", success: "" });
      setIsLeaveConfirmOpen(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (projectData?.certificate) {
      // CERTIFICATE: нормализуем ссылку на сертификат для кнопки
      setCertificateUrl(projectData.certificate);
    } else {
      setCertificateUrl("");
    }
  }, [projectData?.certificate]);

  const participantIds = React.useMemo(() => {
    if (!Array.isArray(projectData?.participants)) return [];
    return projectData.participants
      .map((participant) => {
        if (participant && typeof participant === "object") {
          return participant.id ?? participant.user_id ?? null;
        }
        return participant;
      })
      .filter((id) => id !== null && id !== undefined);
  }, [projectData?.participants]);

  const fetchParticipants = React.useCallback(async () => {
    if (!participantIds.length) {
      setParticipants([]);
      return;
    }

    setIsLoadingParticipants(true);
    try {
      const requests = participantIds.map((participantId) =>
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
  }, [participantIds]);

  React.useEffect(() => {
    if (!isOpen) return;
    fetchParticipants();
  }, [fetchParticipants, isOpen]);

  const currentUserId = user?.id;

  const isCurrentUserParticipant = React.useMemo(() => {
    if (!currentUserId) return false;
    if (!Array.isArray(projectData?.participants)) return false;
    return projectData.participants.some((participant) => {
      if (participant && typeof participant === "object") {
        const participantId = participant.id ?? participant.user_id;
        return Number(participantId) === Number(currentUserId);
      }
      return Number(participant) === Number(currentUserId);
    });
  }, [currentUserId, projectData?.participants]);

  const canLeaveProject = Boolean(projectData?.id) && isCurrentUserParticipant;

  const handleOpenCertificate = React.useCallback(() => {
    if (!certificateUrl) return;
    window.open(certificateUrl, "_blank", "noopener,noreferrer");
  }, [certificateUrl]);

  const openLeaveConfirm = React.useCallback(() => {
    if (isLeaving) return;
    setFeedback((prev) => ({ ...prev, error: "" }));
    setIsLeaveConfirmOpen(true);
  }, [isLeaving]);

  const closeLeaveConfirm = React.useCallback(() => {
    if (isLeaving) return;
    setIsLeaveConfirmOpen(false);
  }, [isLeaving]);

  const handleLeaveProject = React.useCallback(async () => {
    if (isLeaving) return;
    if (!projectData?.id || !currentUserId) return;

    setIsLeaving(true);
    setFeedback({ error: "", success: "" });

    try {
      // LEAVE: отправляем запрос на выход из проекта
      await axiosInstance.post(`/projects/${projectData.id}/leave`);

      const updatedParticipants = Array.isArray(projectData.participants)
        ? projectData.participants.filter((participant) => {
            if (participant && typeof participant === "object") {
              const participantId = participant.id ?? participant.user_id;
              return Number(participantId) !== Number(currentUserId);
            }
            return Number(participant) !== Number(currentUserId);
          })
        : [];

      const updatedProject = {
        ...projectData,
        participants: updatedParticipants,
      };

      setProjectData(updatedProject);
      setParticipants((prev) =>
        prev.filter((participant) => {
          const participantId = participant?.id ?? participant?.user_id;
          return Number(participantId) !== Number(currentUserId);
        })
      );
      setFeedback({ error: "", success: "Вы вышли из проекта" });
      onProjectUpdate?.(updatedProject);

      window.setTimeout(() => {
        onProjectLeave?.(projectData.id);
      }, 1200);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Не удалось выйти из проекта";
      setFeedback({ error: message, success: "" });
    } finally {
      setIsLeaving(false);
      setIsLeaveConfirmOpen(false);
    }
  }, [
    currentUserId,
    isLeaving,
    onProjectLeave,
    onProjectUpdate,
    projectData,
  ]);

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

  const getAvatarSrc = (u) => (u?.avatar ? u.avatar : null);

  if (!projectData) return null;

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

        {(feedback.error || feedback.success) && (
          <div>
            {feedback.error && (
              <div className={style.errorMessage}>{feedback.error}</div>
            )}
            {feedback.success && (
              <div className={style.successMessage}>{feedback.success}</div>
            )}
          </div>
        )}

        <div className={style.section}>
          {/* Превью */}
          {projectData.preview_image ? (
            <div className={style.projectImageSection}>
              <img
                src={projectData.preview_image}
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
            <h3 className={style.projectName}>{projectData.name}</h3>
            <span
              className={`${style.statusBadge} ${
                projectData.status
                  ?
                    style[`status_${projectData.status}`] ||
                    style.status_default
                  : style.status_default
              }`}
              title={`Статус: ${getStatusText(projectData.status)}`}
            >
              {getStatusText(projectData.status)}
            </span>
          </div>

          {/* Описание */}
          <div className={style.projectDescription}>
            <h4>Описание</h4>
            <p className={style.lineClamp}>
              {projectData.description || "Описание отсутствует"}
            </p>
          </div>

          {/* Детали (без создан/обновлён) */}
          <div className={style.projectDetails}>
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата начала:</span>
              <span className={style.detailValue}>
                {formatDate(projectData.start_date)}
              </span>
            </div>

            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата окончания:</span>
              <span className={style.detailValue}>
                {formatDate(projectData.end_date)}
              </span>
            </div>

            <div className={style.detailRow}>
              <span className={style.detailLabel}>Подтвержден:</span>
              <span className={style.detailValue}>
                {projectData.is_approved ? "Да" : "Нет"}
              </span>
            </div>
          </div>

          {/* Сертификат */}
          {certificateUrl && (
            <div className={style.certificateSection}>
              <button
                type="button"
                className={style.primaryButton}
                onClick={handleOpenCertificate}
                aria-label="Получить сертификат"
              >
                {/* CERTIFICATE: кнопка для открытия сертификата */}
                Получить сертификат
              </button>
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
            {canLeaveProject && (
              <button
                type="button"
                className={style.dangerButton}
                onClick={openLeaveConfirm}
                disabled={isLeaving}
              >
                {/* LEAVE: основной триггер для выхода из проекта */}
                {isLeaving ? "Выходим..." : "Выйти из проекта"}
              </button>
            )}
            <InviteProjectButton
              projectId={projectData.id}
              projectName={projectData.name}
            />
            <button className={style.secondaryButton} onClick={onRequestClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isLeaveConfirmOpen}
        message="Вы действительно хотите выйти из проекта?"
        onConfirm={handleLeaveProject}
        onCancel={closeLeaveConfirm}
        confirmText={isLeaving ? "Выходим..." : "Выйти"}
        cancelText="Отмена"
      />
    </Modal>
  );
};

export default InfoModalProject;
