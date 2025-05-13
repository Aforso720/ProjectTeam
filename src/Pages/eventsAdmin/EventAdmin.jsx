import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./EventAdmin.scss";

// Установка корневого элемента для модального окна (для доступности)
Modal.setAppElement('#root');

const EventAdmin = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
  const [eventData, setEventData] = useState({
    type: "forums",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    participants: [
      { id: 1, name: "Эльдарханов Абдул-Малик", selected: false },
      { id: 2, name: "Алаудинов Илисхан", selected: true }
    ]
  });
  const navigate = useNavigate();

  const events = [
    {
      id: "1",
      title: "КЕЙС-ЧЕМПИОНАТ",
      description: "ГОДИЧНОЕ ЭФФЕКТИВНОЕ РАЗВИТИЕ СЕБЯ, А. К. ОФАРАХА",
      type: "contests",
      date: "2025-02-01T00:00:00",
      image: "/img/image2.png"
    },
    {
      id: "2",
      title: "PROJECT TEAM/GETIP НА ФОРУМЕ В ПЯТИГОРСКЕ",
      description: "",
      type: "forums",
      date: "2025-02-01T00:00:00",
      image: "/img/image2.png"
    },
    {
      id: "3",
      title: "ТЕХНОЛОГИЧЕСКИЙ ФЕСТИВАЛЬ",
      description: "ИННОВАЦИОННЫЕ РАЗРАБОТКИ И ПРОЕКТЫ",
      type: "forums",
      date: "2025-03-15T00:00:00",
      image: "/img/image2.png"
    },
    {
      id: "4",
      title: "ДИЗАЙН-БАТТЛ",
      description: "СОРЕВНОВАНИЕ ДИЗАЙНЕРОВ",
      type: "contests",
      date: "2025-04-10T00:00:00",
      image: "/img/image2.png"
    },
    {
      id: "5",
      title: "СТАРТАП КОНФЕРЕНЦИЯ",
      description: "",
      type: "forums",
      date: "2025-05-20T00:00:00",
      image: "/img/image2.png"
    },
    {
      id: "6",
      title: "ХАКАТОН 2025",
      description: "48 ЧАСОВ ИНТЕНСИВНОЙ РАБОТЫ",
      type: "contests",
      date: "2025-06-05T00:00:00",
      image: "/img/image2.png"
    }
  ];

  const handleAddParticipant = () => {
  if (newParticipantName.trim()) {
    const newId = Math.max(0, ...eventData.participants.map(p => p.id)) + 1;
    setEventData(prev => ({
      ...prev,
      participants: [
        ...prev.participants,
        { id: newId, name: newParticipantName, selected: true }
      ]
    }));
    setNewParticipantName("");
  }
};

const handleViewEvent = (event) => {
  setCurrentEvent(event);
  setIsViewModalOpen(true);
  setIsEditMode(false);
};

const handleEditEvent = (event) => {
  setCurrentEvent(event);
  setIsViewModalOpen(true);
  setIsEditMode(true);
  // Заполняем форму данными события
  setEventData({
    type: event.type,
    title: event.title,
    startDate: event.date.split('T')[0],
    endDate: event.date.split('T')[0], // или используйте реальную дату окончания
    description: event.description,
    participants: eventData.participants // или реальные участники события
  });
};

const handleRemoveParticipant = (id) => {
  setEventData(prev => ({
    ...prev,
    participants: prev.participants.filter(p => p.id !== id)
  }));
};

  const filters = [
    { id: "all", name: "Все" },
    { id: "contests", name: "Конкурсы" },
    { id: "forums", name: "Форумы" }
  ];

  const filteredEvents = activeFilter === "all"
    ? events
    : events.filter(event => event.type === activeFilter);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantToggle = (id) => {
    setEventData(prev => ({
      ...prev,
      participants: prev.participants.map(participant => 
        participant.id === id 
          ? { ...participant, selected: !participant.selected } 
          : participant
      )
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  if (isEditMode && currentEvent) {
    // Логика обновления существующего мероприятия
    console.log("Обновление мероприятия:", {
      ...eventData,
      id: currentEvent.id
    });
    setIsViewModalOpen(false);
  } else {
    // Логика создания нового мероприятия
    console.log("Создание мероприятия:", eventData);
    setIsModalOpen(false);
  }
  
  // Сброс формы
  setEventData({
    type: "forums",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    participants: [
      { id: 1, name: "Эльдарханов Абдул-Малик", selected: false },
      { id: 2, name: "Алаудинов Илисхан", selected: true }
    ]
  });
};

  return (
    <div className="event-admin">
      <div className="event-filters">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="event-list">
        <div className="addEvent" onClick={() => setIsModalOpen(true)}>
          <img src="/img/adminAddJournal.png" alt="" />
          <div>Добавить</div>
        </div>

        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div 
              className="event-image"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <div className="event-details">
              <h3>{event.title}</h3>
              {event.description && <p>{event.description}</p>}
              <div className="event-footer">
                <span className="event-date">
                  {new Date(event.date).toLocaleDateString("ru-RU")}
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

<Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  className="event-modal"
  overlayClassName="event-modal-overlay"
>
  <div className="modal-header">
    <h2>Добавление мероприятия</h2>
  </div>
  
  <form onSubmit={handleSubmit}>
    <div className="modal-section">
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
    </div>

    <div className="modal-section">
      <h3>Название мероприятия</h3>
      <input
        type="text"
        name="title"
        value={eventData.title}
        onChange={handleInputChange}
        className="modal-input"
        placeholder="Введите название"
        required
      />
    </div>

    <div className="modal-dates">
      <div className="modal-section">
        <h3>Дата начала</h3>
        <input
          type="date"
          name="startDate"
          value={eventData.startDate}
          onChange={handleInputChange}
          className="modal-input"
          required
        />
      </div>

      <div className="modal-section">
        <h3>Дата окончания</h3>
        <input
          type="date"
          name="endDate"
          value={eventData.endDate}
          onChange={handleInputChange}
          className="modal-input"
          required
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
      <h3>Участники</h3>
      <div className="participants-list">
        {eventData.participants.filter(p => p.selected).map(participant => (
          <div key={participant.id} className="participant-item selected">
            <span>{participant.name}</span>
            <button 
              type="button"
              className="remove-participant"
              onClick={() => handleParticipantToggle(participant.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <button 
        type="button"
        className="manage-participants-btn"
        onClick={() => setIsParticipantModalOpen(true)}
      >
        Управление участниками
      </button>
    </div>

    <div className="modal-actions">
      <button 
        type="button" 
        className="modal-cancel"
        onClick={() => setIsModalOpen(false)}
      >
        Отменить
      </button>
      <button 
        type="submit" 
        className="modal-save"
      >
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
        <button 
          type="button"
          className="add-participant-btn"
          onClick={handleAddParticipant}
        >
          +
        </button>
      </div>
      <div className="participants-to-add">
        {eventData.participants.filter(p => !p.selected).map(participant => (
          <div key={participant.id} className="participant-item">
            <span>{participant.name}</span>
            <button 
              type="button"
              className="add-participant-btn"
              onClick={() => handleParticipantToggle(participant.id)}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>

    <div className="participant-section">
      <h3>Удалить участника</h3>
      <div className="participants-to-remove">
        {eventData.participants.filter(p => p.selected).map(participant => (
          <div key={participant.id} className="participant-item">
            <button 
              type="button"
              className="remove-participant"
              onClick={() => handleParticipantToggle(participant.id)}
            >
              ×
            </button>
            <span>{participant.name}</span>
          </div>
        ))}
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
  onRequestClose={() => setIsViewModalOpen(false)}
  className="event-modal"
  overlayClassName="event-modal-overlay"
>
  <div className="modal-header">
    <h2>{isEditMode ? 'Редактирование мероприятия' : 'Просмотр мероприятия'}</h2>
  </div>
  
  {isEditMode ? (
    <form onSubmit={handleSubmit}>
      <div className="modal-section">
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
      </div>

      <div className="modal-section">
        <h3>Название мероприятия</h3>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleInputChange}
          className="modal-input"
          placeholder="Введите название"
          required
        />
      </div>

      <div className="modal-dates">
        <div className="modal-section">
          <h3>Дата начала</h3>
          <input
            type="date"
            name="startDate"
            value={eventData.startDate}
            onChange={handleInputChange}
            className="modal-input"
            required
          />
        </div>

        <div className="modal-section">
          <h3>Дата окончания</h3>
          <input
            type="date"
            name="endDate"
            value={eventData.endDate}
            onChange={handleInputChange}
            className="modal-input"
            required
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
        <h3>Участники</h3>
        <div className="participants-list">
          {eventData.participants.filter(p => p.selected).map(participant => (
            <div key={participant.id} className="participant-item selected">
              <span>{participant.name}</span>
              <button 
                type="button"
                className="remove-participant"
                onClick={() => handleParticipantToggle(participant.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <button 
          type="button"
          className="manage-participants-btn"
          onClick={() => setIsParticipantModalOpen(true)}
        >
          Управление участниками
        </button>
      </div>

      <div className="modal-actions">
        <button 
          type="button" 
          className="modal-cancel"
          onClick={() => setIsViewModalOpen(false)}
        >
          Отменить
        </button>
        <button 
          type="submit" 
          className="modal-save"
        >
          Сохранить изменения
        </button>
      </div>
    </form>
  ) : (
    <div className="view-mode">
      <div className="modal-section">
        <h3>Тип мероприятия</h3>
        <p>{currentEvent?.type === 'forums' ? 'Форум' : 'Конкурс'}</p>
      </div>

      <div className="modal-section">
        <h3>Название мероприятия</h3>
        <p>{currentEvent?.title}</p>
      </div>

      <div className="modal-dates">
        <div className="modal-section">
          <h3>Дата проведения</h3>
          <p>{new Date(currentEvent?.date).toLocaleDateString('ru-RU')}</p>
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
          onClick={() => setIsViewModalOpen(false)}
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
    </div>
  );
};

export default EventAdmin;