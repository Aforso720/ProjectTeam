import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import { MyContext } from "../../App";

const AddEventModal = () => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { authToken, user } = React.useContext(MyContext);
  const [participants, setParticipants] = React.useState([
  ]);
  const [newParticipant, setNewParticipant] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (index) => {
    const updated = [...participants];
    updated.splice(index, 1);
    setParticipants(updated);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setError(null);
    setProjectName("");
    setDescription("");
    setParticipants([]);
  };

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      setError("Название проекта обязательно");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5555/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: projectName,
          description: description,
          user_id: user?.id,
          participants: participants,
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании проекта");
      }

      const data = await response.json();
      console.log("Проект успешно создан:", data);
      closeModal();
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "800px",
      maxWidth: "95%",
      padding: "30px",
      borderRadius: "12px",
      backgroundColor: "#fff",
      overflow: "auto",
      border: "1px solid #4B1218",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      overflow: "auto",
    },
  };

  return (
    <div>
      <div className={style.addedEvent}>
        <img src="/img/carbon_ibm-cloud-projects.png" alt="img" />
        <button onClick={openModal}>Добавить проект</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className={style.Modal}>
          <div className={style.modalHeader}>
            <h2>Добавление проекта</h2>
            <button className={style.closeButton} onClick={closeModal}>
              ✕
            </button>
          </div>

          {error && <div className={style.errorMessage}>{error}</div>}

          <div className={style.section}>
            <input
              type="text"
              className={style.projectInput}
              placeholder="Название проекта"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
              className={style.projectInput}
              placeholder="Краткое описание"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={style.section}>
            <h3>Добавить участников</h3>
            <div className={style.participantsList}>
              {participants.map((name, index) => (
                <div key={index} className={style.participantItem}>
                  <span>{name}</span>
                  <button
                    type="button"
                    className={style.removeButton}
                    onClick={() => handleRemoveParticipant(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className={style.addParticipantRow}>
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  className={style.participantInput}
                  placeholder="Введите имя участника"
                />
                <button
                  type="button"
                  className={style.addButton}
                  onClick={handleAddParticipant}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={style.section}>
            <h3>Медиафайлы</h3>
            <div className={style.fileList}>
              <label className={style.fileUpload}>
                <input type="file" hidden multiple />
                <div>📁 Прикрепить медиафайл</div>
              </label>
            </div>
          </div>

          <div className={style.section}>
            <button 
              className={style.saveButton} 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEventModal;