import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import style from "./MyDocument.module.scss";
import axiosInstance from "../../API/axiosInstance";

const DocumentModal = ({ onDocumentAdded }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const fileInputRef = useRef(null);               // NEW: ref на скрытый <input>
  const prevUrlRef = useRef(null);                 // NEW: чтобы корректно revokeObjectURL
  const [isDragging, setIsDragging] = useState(false); // NEW: drag state

  const [myDocumObj, setMyDocumObj] = useState({
    id: Date.now(),
    image: "",          // objectURL для превью
    file: null,         // исходный файл
    fileType: "",       // "image" | "pdf"
    fileName: "",       // имя файла (для PDF-карточки)
    description: "",
    startDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const openModal = () => setModalIsOpen(true);

  const resetState = () => {
    // корректно чистим предыдущий objectURL
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setMyDocumObj({
      id: Date.now(),
      image: "",
      file: null,
      fileType: "",
      fileName: "",
      description: "",
      startDate: "",
    });
    setError(null);
    setShouldSubmit(false);
  };

  const closeModal = () => {
    resetState();
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMyDocumObj((prev) => ({ ...prev, [name]: value }));
  };

  // Открыть системный выбор файла
  const openFilePicker = () => fileInputRef.current?.click();

  const handleKeyDownField = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  // Универсальная обработка выбора/перетаскивания
  const applyFile = (file) => {
    if (!file) return;

    // Разрешенные типы: картинка или PDF
    const isImage = file.type?.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      setError("Разрешены только изображения (JPG/PNG/HEIC) или PDF");
      return;
    }

    // освобождаем предыдущий objectURL
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    prevUrlRef.current = objectUrl;

    setMyDocumObj((prev) => ({
      ...prev,
      image: objectUrl,
      file,
      fileType: isPdf ? "pdf" : "image",
      fileName: file.name || "",
    }));
    setError(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    applyFile(file);
    // очищаем значение, чтобы можно было выбрать тот же файл повторно
    e.target.value = "";
  };

  // Drag & Drop
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    applyFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setMyDocumObj((prev) => ({
      ...prev,
      image: "",
      file: null,
      fileType: "",
      fileName: "",
    }));
  };

  useEffect(() => {
    return () => {
      // revoke при размонтировании модалки
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

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

        closeModal();
        onDocumentAdded?.(response.data);
      } catch (err) {
        console.error("Ошибка при сохранении сертификата:", err.response?.data || err);
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

            {/* === ЕДИНОЕ КЛИКАБЕЛЬНОЕ ПОЛЕ ЗАГРУЗКИ/СМЕНЫ ФАЙЛА === */}
            <div
              className={`${style.uploadField} ${isDragging ? style.uploadFieldDragging : ""} ${myDocumObj.image ? style.uploadWithPreview : style.uploadEmpty}`}
              role="button"
              tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={handleKeyDownField}
              onDragOver={onDragOver}
              onDragEnter={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              aria-label={myDocumObj.image ? "Нажмите, чтобы сменить файл" : "Нажмите или перетащите файл для загрузки"}
            >
              {/* Скрытый input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className={style.visuallyHidden}
                onChange={handleFileUpload}
              />

              {/* Превью */}
              {myDocumObj.image ? (
                <>
                  {myDocumObj.fileType === "image" ? (
                    <div className={`media-contain ${style.previewImageWrapper}`}>
                      <img
                        src={myDocumObj.image}
                        alt="Предпросмотр сертификата"
                      />
                    </div>
                  ) : (
                    <div className={style.previewPdf}>
                      <img src="img/pdf-icon.svg" alt="PDF" />
                      <div className={style.fileInfo}>
                        <span className={style.fileName} title={myDocumObj.fileName}>
                          {myDocumObj.fileName || "Файл PDF"}
                        </span>
                        <span className={style.fileBadge}>PDF</span>
                      </div>
                    </div>
                  )}

                  {/* Ховер-подсказка */}
                  <div className={style.overlayHint}>
                    Нажмите, чтобы поменять
                  </div>

                  {/* Кнопка очистки в углу */}
                  <button
                    type="button"
                    className={style.removeBtn}
                    onClick={clearFile}
                    aria-label="Очистить файл"
                    title="Очистить"
                  >
                    ×
                  </button>
                </>
              ) : (
                // Пустое состояние (иконка + текст)
                <div className={style.uploadEmptyInner}>
                  <img src="img/gallery-add.png" alt="" aria-hidden="true" />
                  <p>
                    Перетащите изображение или PDF<br />
                    <span className={style.muted}>или нажмите, чтобы выбрать</span>
                  </p>
                </div>
              )}
            </div>
            {/* === / ЕДИНОЕ ПОЛЕ === */}
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
