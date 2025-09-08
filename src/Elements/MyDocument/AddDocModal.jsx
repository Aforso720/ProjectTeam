import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import style from "./MyDocument.module.scss";
import axiosInstance from "../../API/axiosInstance";

const DocumentModal = ({ onDocumentAdded }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [myDocumObj, setMyDocumObj] = useState({
    id: Date.now(),
    image: "",
    description: "",
    startDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setMyDocumObj({
      id: Date.now(),
      image: "",
      description: "",
      startDate: "",
    });
    setModalIsOpen(false);
    setError(null);
    setShouldSubmit(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMyDocumObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Разрешены только JPG/PNG/PDF");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setMyDocumObj((prev) => ({
      ...prev,
      image: imageUrl, 
      file, 
    }));
  };

   const validateForm = () => {
    if (!myDocumObj.description || !myDocumObj.startDate || !myDocumObj.file) {
      setError("Пожалуйста, заполните все поля и загрузите файл");
      return false;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (myDocumObj.startDate > today) {
      setError("Дата выдачи не может быть позже сегодняшнего дня");
      return false;
    }
    return true;
  };

  const prepareSubmit = () => {
    if (!validateForm()) return;
    setShouldSubmit(true);
  };

  useEffect(() => {
    if (!shouldSubmit) return;

    const submitData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", myDocumObj.file); 
        formData.append("issued_by", myDocumObj.description); 
        formData.append("issue_date", myDocumObj.startDate); 


        const response = await axiosInstance.post("/certificates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Сертификат успешно создан:", response.data);

        closeModal();
        onDocumentAdded?.(response.data);
      } catch (err) {
        console.error(
          "Ошибка при сохранении сертификата:",
          err.response?.data || err
        );
        setError(
          err.response?.data?.message ||
            "Произошла ошибка при сохранении. Попробуйте снова."
        );
        setShouldSubmit(false);
      } finally {
        setIsLoading(false);
      }
    };

    submitData();
  }, [shouldSubmit, myDocumObj, onDocumentAdded]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "600px",
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

  return (
    <div>
      <div className={style.addedDocum}>
        <img src="img/folder-2.png" alt="img" />
        <button onClick={openModal}>Добавить сертификат</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
      >
        <div className={style.Modal}>
          <h2>Добавить сертификат</h2>
          <div className={style.contentDocum}>
            {error && <div className={style.errorMessage}>{error}</div>}
            <div className={style.inputGroup}>
              <input
                name="description"
                placeholder="Описание сертификата"
                value={myDocumObj.description}
                onChange={handleInputChange}
              />
              <input
                className={style.dataDocum}
                type="date"
                name="startDate"
                max={new Date().toISOString().slice(0, 10)}
                min="1900-01-01"
                value={myDocumObj.startDate}
                onChange={handleInputChange}
              />
            </div>

            {myDocumObj.image ? (
              <div className={style.imagePreview}>
                <img
                  src={myDocumObj.image}
                  alt="Preview"
                  className={style.fullWidthImage}
                />
                <button
                  className={style.changeImageButton}
                  onClick={() =>
                    setMyDocumObj((prev) => ({
                      ...prev,
                      image: "",
                      file: null,
                    }))
                  }
                >
                  Изменить изображение
                </button>
              </div>
            ) : (
              <label className={style.addedPhoto}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />

                <img src="img/gallery-add.png" alt="" />
                <p>Загрузите сертификат</p>
              </label>
            )}
          </div>

          <section className={style.buttonsMyDocum}>
            <button
              className={style.primaryButton}
              onClick={prepareSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Отправка..." : "Сохранить"}
            </button>

            <button className={style.secondaryButton} onClick={closeModal}>
              Отмена
            </button>
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentModal;
