import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import style from "./MyDocument.module.scss";
import axios from "axios";

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
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMyDocumObj((prev) => ({
        ...prev,
        image: imageUrl,
        file: file,
      }));
    }
  };

  const validateForm = () => {
    if (!myDocumObj.description || !myDocumObj.startDate || !myDocumObj.image) {
      setError("Пожалуйста, заполните все поля");
      return false;
    }
    return true;
  };

  const prepareSubmit = () => {
    if (validateForm()) {
      setShouldSubmit(true);
    }
  };

  useEffect(() => {
    if (!shouldSubmit) return;

    const submitData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", myDocumObj.file);
        formData.append("description", myDocumObj.description);
        formData.append("date", myDocumObj.date);
        formData.append("startDate", myDocumObj.startDate);
        formData.append("endDate", myDocumObj.endDate || myDocumObj.startDate);

        const response = await axios.post(
          "https://67b9c5be51192bd378de636d.mockapi.io/MyDocument",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Данные успешно отправлены:", response.data);
        closeModal();
        // Вызываем функцию обновления после успешного создания
        if (onDocumentAdded) {
          onDocumentAdded();
        }
      } catch (err) {
        console.error("Ошибка при отправке данных:", err);
        setError("Произошла ошибка при сохранении. Попробуйте снова.");
        setShouldSubmit(false);
      } finally {
        setIsLoading(false);
      }
    };

    submitData();
  }, [shouldSubmit]);

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
          {/* <img
            className={style.closeModal}
            src="img/+.png"
            onClick={closeModal}
            alt=""
          /> */}
          <div className={style.contentDocum}>
            {error && <div className={style.errorMessage}>{error}</div>}
            <div className={style.inputGroup}>
              <input
                className={`${style.infoDocum}`}
                name="description"
                placeholder="Описание. Пример: Tech Innovators Summit in Moscow"
                value={myDocumObj.description}
                onChange={handleInputChange}
              />
              <input
                className={`${style.dataDocum}`}
                name="startDate"
                placeholder="Дата начала. Пример: 2025-02-20"
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
                  accept="image/*,.pdf,.doc,.docx"
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
            className={style.submitButton}
            onClick={prepareSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Отправка..." : "Сохранить"}
          </button>
          <button
            className={style.submitButton}
             onClick={closeModal}
          >
            Отмена
          </button>
         </section>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentModal;
