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
  const [previewImage, setPreviewImage] = React.useState(null);  // файл
  const [previewUrl, setPreviewUrl] = React.useState("");        // blob-URL для <img>
  const [fileErr, setFileErr] = React.useState("");              // ошибки файла
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedParticipants, setSelectedParticipants] = React.useState([]);

  const MAX_MB = 5;

  const revokePreview = React.useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setError(null);
    setFileErr("");
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setPreviewImage(null);
    revokePreview();
    setPreviewUrl("");
  };

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setFileErr("Поддерживаются только изображения (PNG, JPG).");
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileErr(`Файл больше ${MAX_MB}MB.`);
      return false;
    }
    setFileErr("");
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;
    revokePreview();
    const url = URL.createObjectURL(file);
    setPreviewImage(file);
    setPreviewUrl(url);
  };

  React.useEffect(() => {
    return () => {
      // очистка при размонтировании
      revokePreview();
    };
  }, [revokePreview]);

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
    // вместо top/left/transform используем центрирование через overlay
    inset: 'unset',
    width: 'min(92vw, 720px)',
    maxHeight: '88vh',            // <— ограничиваем высоту
    padding: 0,
    borderRadius: '16px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',           
    overflow: "auto",
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
    display: 'grid',              // <— центрирование окна
    placeItems: 'center',
    padding: '16px',              // чтобы окно не прилипало к краям
    backdropFilter: 'blur(2px)',
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
              min="1900-01-01"
              max="2100-12-31"
            />

            <h3>Дата окончания</h3>
            <input
              type="date"
              className={style.projectInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min="1900-01-01"
              max="2100-12-31"
            />
          </div>

          {/* Медиафайл с мгновенным превью */}
          <div className={style.section}>
            <h3>Медиафайлы</h3>
            <div className={style.fileList}>
              <label className={style.fileUpload}>
                <input
                  type="file"
                  accept="image/*"
                  className={style.fileInput}
                  onChange={handleFileChange}
                />
                <div className={style.filePreview}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Превью"
                      className={style.previewImage}
                    />
                  ) : (
                    <div className={style.filePlaceholder}>
                      <span>+ Загрузить изображение</span>
                      <p>PNG, JPG до {MAX_MB}MB</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            {fileErr && <div className={style.fileError}>{fileErr}</div>}
          </div>

          {/* Кнопки */}
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
  