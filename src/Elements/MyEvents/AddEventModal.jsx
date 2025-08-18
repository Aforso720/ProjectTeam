import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import axiosInstance from "../../API/axiosInstance";
import usePeople from "../../API/usePeople";
import { AuthContext } from "../../context/AuthContext";

const AddEventModal = () => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { user } = React.useContext(AuthContext);
  const { person } = usePeople({});
  const [projectName, setProjectName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedParticipants, setSelectedParticipants] = React.useState([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setError(null);
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      setError("Название проекта обязательно");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("description", description);
      if (previewImage) formData.append("preview_image", previewImage);
      if (startDate) formData.append("start_date", startDate);
      if (endDate) formData.append("end_date", endDate);

      const response = await axiosInstance.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const projectId = response.data?.id;

      if (projectId) {
        await axiosInstance.post(`/projects/${projectId}/join`, {});
        await Promise.all(
          selectedParticipants.map((participantId) =>
            axiosInstance.post(`/projects/${projectId}/join`, {
              user_id: participantId,
            })
          )
        );
      }

      console.log("Проект создан и участники добавлены:", response.data);
      closeModal();
      setSelectedParticipants([]);
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
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

          {/* Название и описание */}
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

          {/* Даты */}
          <div className={style.section}>
            <h3>Дата начала</h3>
            <input
              type="date"
              className={style.projectInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <h3>Дата окончания</h3>
            <input
              type="date"
              className={style.projectInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Участники */}
          <div className={style.section}>
            <h3>Добавить участников</h3>
            <select
              className={style.projectInput}
              onChange={(e) => {
                const userId = parseInt(e.target.value);
                if (!selectedParticipants.includes(userId)) {
                  setSelectedParticipants([...selectedParticipants, userId]);
                }
              }}
            >
              <option value="">Выберите участника</option>
              {person.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name} {p.first_name}
                </option>
              ))}
            </select>

            <div className={style.participantsList}>
              {selectedParticipants.map((id) => {
                const userObj = person.find((p) => p.id === id);
                const displayName = userObj
                  ? `${userObj.first_name} ${userObj.last_name}`
                  : `ID ${id}`;

                return (
                  <div key={id} className={style.participantItem}>
                    <span>{displayName}</span>
                    <button
                      type="button"
                      className={style.removeButton}
                      onClick={() =>
                        setSelectedParticipants(
                          selectedParticipants.filter((uid) => uid !== id)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Файл */}
          <div className={style.section}>
            <h3>Медиафайлы</h3>
            <div className={style.fileList}>
              <label className={style.fileUpload}>
                <input
                  type="file"
                  hidden
                  onChange={(e) => setPreviewImage(e.target.files[0])}
                />
                <div>
                  📁 {previewImage ? previewImage.name : "Прикрепить медиафайл"}
                </div>
              </label>
            </div>
          </div>

          {/* Кнопка */}
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
