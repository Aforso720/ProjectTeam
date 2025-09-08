import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./NewsAdmin.scss";
import axiosInstance from "../../API/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputField from "../../utils/InputField";
import { useForm } from "react-hook-form";

Modal.setAppElement("#root");

// хелперы для даты
const toInputDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const toServerDate = (input) => (input ? `${input} 00:00:00` : "");

const ALLOWED = ["active", "completed"];

const NewsAdmin = () => {
  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      date: toInputDate(new Date()),
      status: "active",
    },
  });

  const titleError = formState.errors["title"]?.message;
  const dateError = formState.errors["date"]?.message;

  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/news?page=${page}&per_page=5`);
      const result = response.data;
      setNewsList(result.data);
      setTotalPages(result.meta.last_page);
      setCurrentPage(result.meta.current_page);
    } catch (error) {
      console.error("Ошибка загрузки новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    const ok = window.confirm("Удалить новость?");
    if (!ok) return;
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/news/${id}`);
      if (newsList.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        await fetchNews(currentPage);
      }
    } catch (error) {
      console.error("Не удалось удалить:", error.response?.data || error);
      alert(error.response?.data?.message || "Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditNews = (news) => {
    setCurrentNews(news);
    setIsViewModalOpen(true);
    setIsEditMode(true);
    reset({
      title: news.title || "",
      date: news.date ? news.date.substring(0, 10) : toInputDate(new Date()),
      status: ALLOWED.includes(news.status) ? news.status : "active",
    });
    setContent(news.content || "");
    setPreviewImage(null);
  };

  const handleViewNews = (news) => {
    setCurrentNews(news);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  const createNews = async (data) => {
    try {
      const status = ALLOWED.includes(data.status) ? data.status : "active";
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("content", content);
      formData.append("status", status);
      formData.append("date", toServerDate(data.date));
      if (previewImage) formData.append("preview_image", previewImage);

      await axiosInstance.post("/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchNews(currentPage);
    } catch (error) {
      console.error(
        "Ошибка при создании новости:",
        error.response?.data || error
      );
      alert(error.response?.data?.message || "Ошибка при создании");
    }
  };

  const updateNews = async (data) => {
    if (!currentNews) return;
    try {
      const status = ALLOWED.includes(data.status) ? data.status : "active";
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("content", content);
      formData.append("status", status);
      formData.append("date", toServerDate(data.date));
      if (previewImage) formData.append("preview_image", previewImage);

      const response = await axiosInstance.post(
        `/news/${currentNews.id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedNews = response.data.data;
      setNewsList((prev) =>
        prev.map((n) => (n.id === updatedNews.id ? updatedNews : n))
      );
      setIsViewModalOpen(false);
      setIsEditMode(false);
      setCurrentNews(null);
    } catch (error) {
      console.error(
        "Ошибка при обновлении новости:",
        error.response?.data || error
      );
      alert(error.response?.data?.message || "Ошибка при обновлении");
    }
  };

  const onSubmit = async (data) => {
    if (isEditMode && currentNews) {
      await updateNews(data);
    } else {
      await createNews(data);
      setIsModalOpen(false);
    }
    reset({ title: "", date: toInputDate(new Date()), status: "active" });
    setContent("");
    setPreviewImage(null);
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  return (
    <section className="news-admin">
      <div className="news-list">
        <div
          className="addNews"
          onClick={() => {
            reset({ title: "", date: toInputDate(new Date()), status: "active" });
            setContent("");
            setPreviewImage(null);
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <img src="/img/adminAddJournal.png" alt="" />
          <div>Добавить новость</div>
        </div>

        {/* карточки новостей */}
        {newsList.map((news) => (
          <div key={news.id} className="news-card">
            <button
              className="news-delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNews(news.id);
              }}
              disabled={deletingId === news.id}
            >
              <img src="/img/DeleteCor.svg" alt="Удалить" />
            </button>

            <div
              className="news-image"
              style={{ backgroundImage: `url(${news.preview_image})` }}
            />
            <div className="news-details">
              <h3>{news.title}</h3>
              <div className="news-actions">
                <button onClick={() => handleViewNews(news)}>Посмотреть</button>
                <button onClick={() => handleEditNews(news)}>
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <ul className="paginationNews">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={currentPage === page ? "active_page" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={isModalOpen || isViewModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setIsViewModalOpen(false);
        }}
        className="event-modal"
        overlayClassName="event-modal-overlay"
      >
        <div className="modal-header">
          <h2>
            {isEditMode
              ? "Редактирование новости"
              : isModalOpen
              ? "Добавление новости"
              : "Просмотр новости"}
          </h2>
        </div>

        {isEditMode || isModalOpen ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-section">
              <h3>Заголовок</h3>
              <InputField
                type="text"
                name="title"
                className="modal-input"
                register={register}
                validation={{ required: "Введите заголовок" }}
                error={titleError}
              />
            </div>

            <div className="modal-section">
              <h3>Описание</h3>
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                className="modal-textarea"
              />
            </div>

            <div className="modal-section">
              <h3>Дата</h3>
              <InputField
                type="date"
                name="date"
                className="modal-input"
                register={register}
                validation={{
                  required: "Укажите дату",
                  validate: (value) => {
                    const year = new Date(value).getFullYear();
                    return (
                      year >= 1900 && year <= 2100 ||
                      "Год должен быть между 1900 и 2100"
                    );
                  },
                }}
                error={dateError}
                min="1900-01-01"
                max="2100-12-31"
              />
            </div>

            <div className="modal-section">
              <h3>Статус</h3>
              <select
                name="status"
                className="modal-input"
                {...register("status")}
              >
                <option value="active">Активный</option>
                <option value="completed">Завершённый</option>
              </select>
            </div>

            <div className="modal-section">
              <h3>Превью</h3>
              {previewImage ? (
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <img
                    src={URL.createObjectURL(previewImage)}
                    alt="preview"
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      color: "white",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                    aria-label="Удалить изображение"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="file-upload-label">
                  <img src="/img/gallery-add.png" alt="Добавить изображение" />
                  <p>Загрузите изображение</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPreviewImage(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsViewModalOpen(false);
                }}
              >
                Отменить
              </button>
              <button type="submit" className="modal-save">
                {isEditMode ? "Сохранить изменения" : "Сохранить"}
              </button>
            </div>
          </form>
        ) : (
          <div className="view-mode">
            <div className="modal-section">
              <h3>Заголовок</h3>
              <p>{currentNews?.title}</p>
            </div>

            {currentNews?.preview_image && (
              <div className="modal-section">
                <h3>Изображение</h3>
                <img
                  src={currentNews.preview_image}
                  alt="Новость"
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              </div>
            )}

            {currentNews?.date && (
              <div className="modal-section">
                <h3>Дата</h3>
                <p>{new Date(currentNews.date).toLocaleString()}</p>
              </div>
            )}

            {currentNews?.content && (
              <div className="modal-section">
                <h3>Описание</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: currentNews.content }}
                />
              </div>
            )}

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setIsViewModalOpen(false)}
              >
                Закрыть
              </button>
              <button
                className="modal-edit"
                onClick={() => handleEditNews(currentNews)}
              >
                Редактировать
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default NewsAdmin;
