import React from "react";
import Modal from "react-modal";
import style from "./MyEvents.module.scss";
import axiosInstance from "../../API/axiosInstance";

const AddEventModal = () => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
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
      closeModal();
      setSelectedParticipants([]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
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
      width: "90%",
      maxWidth: "640px",
      padding: "0", // паддинги уже есть в .Modal
      borderRadius: "16px",
      backgroundColor: "#fff",
      border: "1px solid #ccc",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
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
            <section className={style.buttonsMyDocum}>
              <button
                className={style.primaryButton}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>

              <button className={style.secondaryButton} onClick={closeModal}>
                Отмена
              </button>
            </section>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEventModal;
