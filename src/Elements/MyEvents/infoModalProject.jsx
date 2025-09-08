import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import axiosInstance from "../../API/axiosInstance";
import { normalizeImageUrl } from "../imageUtils";

const InfoModalProject = ({ project, isOpen, onRequestClose }) => {
  const [participants, setParticipants] = React.useState([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = React.useState(false);
  const [certificateUrl, setCertificateUrl] = React.useState("");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "640px",
      padding: "0",
      borderRadius: "16px",
      backgroundColor: "#fff",
      border: "1px solid #ccc",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  React.useEffect(() => {
    if (project?.participants?.length > 0) {
      fetchParticipants();
    }
  }, [project]);

  React.useEffect(() => {
    if (project?.certificate) {
      setCertificateUrl(normalizeImageUrl(project.certificate));
    }
  }, [project?.certificate]);

  const fetchParticipants = async () => {
    setIsLoadingParticipants(true);
    try {
      const participantRequests = project.participants.map(participantId =>
        axiosInstance.get(`/users/${participantId}`)
      );
      
      const responses = await Promise.all(participantRequests);
      const participantsData = responses.map(response => response.data);
      setParticipants(participantsData);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'completed': 'Завершен',
      'in_progress': 'В процессе',
      'planned': 'Запланирован'
    };
    return statusMap[status] || status;
  };

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className={style.Modal}>
        <div className={style.modalHeader}>
          <h2>Информация о проекте</h2>
          <button className={style.closeButton} onClick={onRequestClose}>
            ✕
          </button>
        </div>

        <div className={style.section}>
          {/* Превью изображение */}
          {project.preview_image && (
            <div className={style.projectImageSection}>
              <img
                src={normalizeImageUrl(project.preview_image)}
                alt="Превью проекта"
                className={style.projectPreviewImage}
                onError={(e) => {
                  e.target.src = '/img/DefaultImage.webp';
                }}
              />
            </div>
          )}

          {/* Название проекта */}
          <h3 className={style.projectName}>{project.name}</h3>

          {/* Описание проекта */}
          <div className={style.projectDescription}>
            <h4>Описание</h4>
            <p>{project.description || "Описание отсутствует"}</p>
          </div>

          {/* Статус и даты */}
          <div className={style.projectDetails}>
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Статус:</span>
              <span className={style.detailValue}>{getStatusText(project.status)}</span>
            </div>
            
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата начала:</span>
              <span className={style.detailValue}>{formatDate(project.start_date)}</span>
            </div>
            
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Дата окончания:</span>
              <span className={style.detailValue}>{formatDate(project.end_date)}</span>
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
              <h4>Сертификат</h4>
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
            <h4>Участники ({project.participants?.length || 0})</h4>
            {isLoadingParticipants ? (
              <div className={style.loadingText}>Загрузка участников...</div>
            ) : participants.length > 0 ? (
              <div className={style.participantsList}>
                {participants.map(participant => (
                  <div key={participant.id} className={style.participantItem}>
                    <span className={style.participantName}>
                      {participant.name || participant.email}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={style.noParticipants}>Участники не найдены</div>
            )}
          </div>

          {/* Информация о создании */}
          <div className={style.metaInfo}>
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Создан:</span>
              <span className={style.detailValue}>
                {formatDate(project.created_at)}
              </span>
            </div>
            
            <div className={style.detailRow}>
              <span className={style.detailLabel}>Обновлен:</span>
              <span className={style.detailValue}>
                {formatDate(project.updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <div className={style.section}>
          <section className={style.buttonsMyDocum}>
            <button className={style.secondaryButton} onClick={onRequestClose}>
              Закрыть
            </button>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModalProject;