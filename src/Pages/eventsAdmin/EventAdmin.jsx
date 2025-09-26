import React, { useRef, useState } from "react";
import Modal from "react-modal";
import "./EventAdmin.scss";
import axiosInstance from "../../API/axiosInstance";
import Loader from "../../Component/Loader";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import ConfirmModal from "../../Elements/ConfirmModal";

Modal.setAppElement("#root");

const createEmptyEventData = () => ({
  type: "forums",
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  previewImageFile: null,
  previewImageUrl: "",
  status: "active",
});

const EventAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventData, setEventData] = useState(createEmptyEventData);
  const previewUrlRef = useRef(null);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState,
  } = useForm({ mode: "onChange" });
  const titleError = formState.errors["title"]?.message;
  const startDateError = formState.errors["startDate"]?.message;
  const endDateError = formState.errors["endDate"]?.message;

  const revokePreviewObjectUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const updatePreviewImage = (file) => {
    setEventData((prev) => {
      revokePreviewObjectUrl();

      if (!file) {
        return {
          ...prev,
          previewImageFile: null,
          previewImageUrl: "",
        };
      }

      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;

      return {
        ...prev,
        previewImageFile: file,
        previewImageUrl: objectUrl,
      };
    });
  };

  const handlePreviewInputChange = (event) => {
    const file = event.target.files?.[0];
    updatePreviewImage(file || null);
    // allow re-selecting the same file
    event.target.value = "";
  };

  const handleRemovePreview = () => {
    if (eventData.previewImageFile || previewUrlRef.current) {
      updatePreviewImage(null);
      if (currentEvent?.preview_image) {
        setEventData((prev) => ({
          ...prev,
          previewImageUrl: currentEvent.preview_image,
        }));
      }
    }
  };

  const resetEventDataState = () => {
    revokePreviewObjectUrl();
    setEventData(createEmptyEventData());
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    resetEventDataState();
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setIsEditMode(false);
    resetEventDataState();
    setCurrentEvent(null);
  };

  React.useEffect(() => () => {
    revokePreviewObjectUrl();
  }, []);

  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirm, setConfirm] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
    confirmText: "Подтвердить",
    hideCancel: false,
  });

  const openConfirm = (message, onConfirm, options = {}) => {
    setConfirm({
      isOpen: true,
      message,
      onConfirm,
      confirmText: options.confirmText || "Подтвердить",
      hideCancel: options.hideCancel || false,
    });
  };

  const closeConfirm = () =>
    setConfirm((prev) => ({ ...prev, isOpen: false }));

  const handleConfirm = async () => {
    if (confirm.onConfirm) {
      await confirm.onConfirm();
    }
    closeConfirm();
  };

  const handleDeleteEvent = (eventId) => {
    openConfirm(
      "Удалить мероприятие?",
      async () => {
        try {
          setDeletingId(eventId);
          await axiosInstance.delete(`/events/${eventId}`);

          if (events.length === 1 && currentPage > 1) {
            setCurrentPage((p) => p - 1);
          } else {
            await fetchEvents(currentPage);
          }
        } catch (error) {
          console.error("Не удалось удалить:", error.response?.data || error);
          openConfirm(
            error.response?.data?.message || "Ошибка при удалении",
            null,
            { confirmText: "ОК", hideCancel: true }
          );
        } finally {
          setDeletingId(null);
        }
      },
      { confirmText: "Удалить" }
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day} 00:00:00`; // сервер ждёт время обязательно
  };

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/events?page=${page}&per_page=5`
      );

      const result = response.data;
      setEvents(result.data);
      setTotalPages(result.meta.last_page);
      setCurrentPage(result.meta.current_page);
    } catch (error) {
      console.error("Ошибка загрузки событий:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (event) => {
    setCurrentEvent(event);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  const handleEditEvent = (event) => {
    revokePreviewObjectUrl();
    setCurrentEvent(event);
    setIsViewModalOpen(true);
    setIsEditMode(true);
    // Заполняем форму данными события
    setEventData({
      type: event.type,
      title: event.title,
      startDate: event.start_date?.split(" ")[0] || "", // YYYY-MM-DD
      endDate: event.end_date?.split(" ")[0] || "",
      status: event.status,
      description: event.description,
      previewImageFile: null,
      previewImageUrl: event.preview_image || "",
    });
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const updateEvent = async () => {
    if (!currentEvent) return;

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description || "");
      formData.append("start_date", formatDateTime(eventData.startDate));
      formData.append("end_date", formatDateTime(eventData.endDate));
      formData.append("status", eventData.status);
      formData.append("type", eventData.type);
      formData.append("project_id", currentEvent.project_id || 4);
      formData.append("_method", "PUT");

      if (eventData.previewImageFile instanceof File) {
        formData.append("preview_image", eventData.previewImageFile);
      }

      const response = await axiosInstance.post(
        `/events/${currentEvent.id}`,
        formData
      );

      const updatedEvent = response.data.data;
      console.log("Обновлено мероприятие:", updatedEvent);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
      return true;
    } catch (error) {
      console.error(
        "Ошибка при обновлении мероприятия:",
        error.response?.data || error
      );
      return false;
    }
  };

  React.useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const createEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description || "");
      formData.append("start_date", formatDateTime(eventData.startDate));
      formData.append("end_date", formatDateTime(eventData.endDate));
      formData.append("status", eventData.status);
      formData.append("type", eventData.type);
      formData.append("project_id", 2);

      if (eventData.previewImageFile) {
        formData.append("preview_image", eventData.previewImageFile);
      }

      const response = await axiosInstance.post("/events", formData);
      const createdEvent = response.data.data;

      console.log("Создано мероприятие:", createdEvent);
      await fetchEvents(currentPage);
      return true;
    } catch (error) {
      console.error(
        "Ошибка при создании мероприятия:",
        error.response?.data || error
      );
      return false;
    }
  };

  const handleFormSubmit = async () => {
    if (isEditMode && currentEvent) {
      const success = await updateEvent();
      if (success) {
        closeViewModal();
      }
    } else {
      const success = await createEvent();
      if (success) {
        closeCreateModal();
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="event-admin">
      <div className="event-list">
        <div
          className="addEvent"
          onClick={() => {
            resetEventDataState();
            setIsEditMode(false); // убедимся, что не редактирование
            setIsModalOpen(true);
          }}
        >
          <img src="/img/adminAddJournal.png" alt="" />
          <div>Добавить</div>
        </div>

        {events.map((event) => (
          <div key={event.id} className="event-card">
            {/* Кнопка удаления */}
            <button
              className="event-delete"
              aria-label="Удалить мероприятие"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(event.id);
              }}
              disabled={deletingId === event.id}
              title="Удалить"
            >
              <img src="/img/DeleteCor.svg" alt="" />
            </button>

            <div className="event-image">
              <div className="media-cover">
                <img
                  src={event.preview_image || "/img/DefaultImage.webp"}
                  alt={`Превью мероприятия ${event.title || ""}`.trim()}
                  onError={(e) => {
                    e.currentTarget.src = "/img/DefaultImage.webp";
                  }}
                />
              </div>
            </div>
            <div className="event-details">
              <h3>{event.title}</h3>
              {event.description && <p>{event.description}</p>}
              <div className="event-footer">
                <span className="event-date">
                  {new Date(event.start_date).toLocaleDateString("ru-RU")} –{" "}
                  {new Date(event.end_date).toLocaleDateString("ru-RU")}
                </span>

                <div className="event-actions">
                  <button
                    className="view-btn"
                    onClick={() => handleViewEvent(event)}
                  >
                    Посмотреть
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditEvent(event)}
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <ul className="paginationEvents">
          <li
            onClick={handlePrevPage}
            className={currentPage === 1 ? "disabled" : ""}
          >
            <img src="/img/arrow-circle-left.png" alt="Назад" />
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              onClick={() => handlePageClick(page)}
              className={currentPage === page ? "active_page" : ""}
            >
              {page}
            </li>
          ))}

          <li
            onClick={handleNextPage}
            className={currentPage === totalPages ? "disabled" : ""}
          >
            <img src="/img/arrow-circle-right.png" alt="Вперёд" />
          </li>
        </ul>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeCreateModal}
        className="event-modal"
        overlayClassName="event-modal-overlay"
      >
        <div className="modal-header">
          <h2>Добавление мероприятия</h2>
        </div>

        <form onSubmit={rhfHandleSubmit(handleFormSubmit)}>
          {/* <div className="modal-section">
            <h3>Тип мероприятия</h3>
            <select
              name="type"
              value={eventData.type}
              onChange={handleInputChange}
              className="modal-input"
            >
              <option value="forums">Форум</option>
              <option value="contests">Конкурс</option>
            </select>
          </div> */}

          <div className="modal-section">
            <h3>Название мероприятия</h3>
            <InputField
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              className="modal-input"
              placeholder="Введите название"
              register={register}
              validation={{ required: "Введите название" }}
              error={titleError}
            />
          </div>

          <div className="modal-dates">
            <div className="modal-section">
              <h3>Дата начала</h3>
              <InputField
                type="date"
                name="startDate"
                value={eventData.startDate}
                onChange={handleInputChange}
                className="modal-input"
                register={register}
                validation={{
                  required: "Укажите дату",
                  validate: (value) => {
                    const y = new Date(value).getFullYear();
                    return (
                      y >= 1900 && y <= 2100 ||
                      "Год должен быть между 1900 и 2100"
                    );
                  },
                }}
                error={startDateError}
                min="1900-01-01"
                max="2100-12-31"
              />
            </div>

            <div className="modal-section">
              <h3>Дата окончания</h3>
              <InputField
                type="date"
                name="endDate"
                value={eventData.endDate}
                onChange={handleInputChange}
                className="modal-input"
                register={register}
                validation={{
                  required: "Укажите дату",
                  validate: (value) => {
                    const y = new Date(value).getFullYear();
                    return (
                      y >= 1900 && y <= 2100 ||
                      "Год должен быть между 1900 и 2100"
                    );
                  },
                }}
                error={endDateError}
                min="1900-01-01"
                max="2100-12-31"
              />
            </div>
          </div>

          <div className="modal-divider"></div>

          <div className="modal-section">
            <h3>Краткое описание</h3>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              className="modal-textarea"
              placeholder="Введите описание мероприятия"
            />
          </div>

          <div className="modal-section">
            <h3>Превью мероприятия</h3>

            <label className="file-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handlePreviewInputChange}
              />
              <img src="/img/gallery-add.png" alt="Добавить изображение" />
              <p>Загрузите изображение</p>
            </label>

            {eventData.previewImageUrl && (
              <div className="image-preview">
                <div className="media-contain">
                  <img
                    src={eventData.previewImageUrl}
                    alt="Превью мероприятия"
                  />
                </div>

                <div className="file-selected">
                  <span className="file-name">
                    {eventData.previewImageFile?.name || "Текущее изображение"}
                  </span>
                  {eventData.previewImageFile && (
                    <button
                      type="button"
                      className="file-remove"
                      onClick={handleRemovePreview}
                      aria-label="Очистить выбранное изображение"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-section">
            <h3>Статус</h3>
            <select
              name="status"
              value={eventData.status}
              onChange={handleInputChange}
              className="modal-input"
            >
              <option value="active">Активное</option>
              <option value="completed">Завершённое</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={closeCreateModal}
            >
              Отменить
            </button>
            <button type="submit" className="modal-save">
              Сохранить
            </button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно управления участниками */}
      <Modal
        isOpen={isParticipantModalOpen}
        onRequestClose={() => setIsParticipantModalOpen(false)}
        className="participant-modal"
        overlayClassName="event-modal-overlay"
      >
        <div className="modal-header">
          <h2>Управление участниками</h2>
        </div>

        <div className="participant-management">
          <div className="participant-section">
            <h3>Добавить участника</h3>
            <div className="add-participant">
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Введите имя участника"
                className="modal-input"
              />
              <button type="button" className="add-participant-btn">
                +
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel"
            onClick={() => setIsParticipantModalOpen(false)}
          >
            Закрыть
          </button>
          <button
            type="button"
            className="modal-save"
            onClick={() => setIsParticipantModalOpen(false)}
          >
            Сохранить
          </button>
        </div>
      </Modal>

      {/* Модальное окно просмотра/редактирования мероприятия */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={closeViewModal}
        className="event-modal"
        overlayClassName="event-modal-overlay"
      >
        <div className="modal-header">
          <h2>
            {isEditMode ? "Редактирование мероприятия" : "Просмотр мероприятия"}
          </h2>
        </div>

        {isEditMode ? (
          <form onSubmit={rhfHandleSubmit(handleFormSubmit)}>
            {/* <div className="modal-section">
              <h3>Тип мероприятия</h3>
              <select
                name="type"
                value={eventData.type}
                onChange={handleInputChange}
                className="modal-input"
              >
                <option value="forums">Форум</option>
                <option value="contests">Конкурс</option>
              </select>
            </div> */}

            <div className="modal-section">
              <h3>Название мероприятия</h3>
              <InputField
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="Введите название"
                register={register}
                validation={{ required: "Введите название" }}
                error={titleError}
              />
            </div>

            <div className="modal-dates">
              <div className="modal-section">
                <h3>Дата начала</h3>
                <InputField
                  type="date"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  className="modal-input"
                  register={register}
                  validation={{
                    required: "Укажите дату",
                    validate: (value) => {
                      const y = new Date(value).getFullYear();
                      return (
                        y >= 1900 && y <= 2100 ||
                        "Год должен быть между 1900 и 2100"
                      );
                    },
                  }}
                  error={startDateError}
                  min="1900-01-01"
                  max="2100-12-31"
                />
              </div>

              <div className="modal-section">
                <h3>Дата окончания</h3>
                <InputField
                  type="date"
                  name="endDate"
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  className="modal-input"
                  register={register}
                  validation={{
                    required: "Укажите дату",
                    validate: (value) => {
                      const y = new Date(value).getFullYear();
                      return (
                        y >= 1900 && y <= 2100 ||
                        "Год должен быть между 1900 и 2100"
                      );
                    },
                  }}
                  error={endDateError}
                  min="1900-01-01"
                  max="2100-12-31"
                />
              </div>
            </div>

            <div className="modal-divider"></div>

            <div className="modal-section">
              <h3>Краткое описание</h3>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                className="modal-textarea"
                placeholder="Введите описание мероприятия"
              />
            </div>

            <div className="modal-section">
              <h3>Превью мероприятия</h3>
              <label className="file-upload-label inline">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePreviewInputChange}
                />
                <img src="/img/gallery-add.png" alt="Добавить изображение" />
                <p>Заменить изображение</p>
              </label>

              {eventData.previewImageUrl && (
                <div className="image-preview">
                  <div className="media-contain">
                    <img
                      src={eventData.previewImageUrl}
                      alt="Текущее превью мероприятия"
                    />
                  </div>
                  <div className="file-selected">
                    <span className="file-name">
                      {eventData.previewImageFile?.name || "Текущее изображение"}
                    </span>
                    {eventData.previewImageFile && (
                      <button
                        type="button"
                        className="file-remove"
                        onClick={handleRemovePreview}
                        aria-label="Очистить выбранное изображение"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-section">
              <h3>Статус</h3>
              <select
                name="status"
                value={eventData.status}
                onChange={handleInputChange}
                className="modal-input"
              >
                <option value="active">Активное</option>
                <option value="completed">Завершённое</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={closeViewModal}
              >
                Отменить
              </button>
              <button type="submit" className="modal-save">
                Сохранить изменения
              </button>
            </div>
          </form>
        ) : (
          <div className="view-mode">
            {/* <div className="modal-section">
              <h3>Тип мероприятия</h3>
              <p>{currentEvent?.type === "forums" ? "Форум" : "Конкурс"}</p>
            </div> */}

            {currentEvent?.preview_image && (
              <div className="modal-section">
                <h3>Превью мероприятия</h3>
                <div className="image-preview">
                  <div className="media-contain">
                    <img
                      src={currentEvent.preview_image}
                      alt={`Превью мероприятия ${currentEvent.title || ""}`.trim()}
                      onError={(e) => {
                        e.currentTarget.src = "/img/DefaultImage.webp";
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="modal-section">
              <h3>Название мероприятия</h3>
              <p>{currentEvent?.title}</p>
            </div>

            <div className="modal-dates">
              <div className="modal-section">
                <h3>Дата проведения</h3>
                <p>
                  {new Date(currentEvent?.start_date).toLocaleDateString(
                    "ru-RU"
                  )}{" "}
                  –{" "}
                  {new Date(currentEvent?.end_date).toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>

            {currentEvent?.description && (
              <div className="modal-section">
                <h3>Краткое описание</h3>
                <p>{currentEvent.description}</p>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={closeViewModal}
              >
                Закрыть
              </button>
              <button
                type="button"
                className="modal-edit"
                onClick={() => handleEditEvent(currentEvent)}
              >
                Редактировать
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={handleConfirm}
        onCancel={confirm.hideCancel ? undefined : closeConfirm}
        confirmText={confirm.confirmText}
        hideCancel={confirm.hideCancel}
      />
    </section>
  );
};

export default EventAdmin;
