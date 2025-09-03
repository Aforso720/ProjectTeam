import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./NewsAdmin.scss";
import axiosInstance from "../../API/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

Modal.setAppElement("#root");

// хелперы для даты
const toInputDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
const toServerDate = (input) => (input ? input.replace("T", " ") + ":00" : "");

const ALLOWED = ["active", "completed"];

const NewsAdmin = () => {
  const initialState = {
    title: "",
    content: "",
    previewImage: null,
    date: toInputDate(new Date()),
    status: "active",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [newsData, setNewsData] = useState(initialState);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditNews = (news) => {
    setCurrentNews(news);
    setIsViewModalOpen(true);
    setIsEditMode(true);
    setNewsData({
      title: news.title || "",
      content: news.content || "",
      previewImage: null,
      date: news.date ? news.date.substring(0, 16) : toInputDate(new Date()),
      status: ALLOWED.includes(news.status) ? news.status : "active",
    });
  };

  const handleViewNews = (news) => {
    setCurrentNews(news);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  const createNews = async () => {
    try {
      const status = ALLOWED.includes(newsData.status)
        ? newsData.status
        : "active";
      const formData = new FormData();
      formData.append("title", newsData.title.trim());
      formData.append("content", newsData.content);
      formData.append("status", status);
      formData.append("date", toServerDate(newsData.date));
      if (newsData.previewImage)
        formData.append("preview_image", newsData.previewImage);

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

  const updateNews = async () => {
    if (!currentNews) return;
    try {
      const status = ALLOWED.includes(newsData.status)
        ? newsData.status
        : "active";
      const formData = new FormData();
      formData.append("title", newsData.title.trim());
      formData.append("content", newsData.content);
      formData.append("status", status);
      formData.append("date", toServerDate(newsData.date));
      if (newsData.previewImage)
        formData.append("preview_image", newsData.previewImage);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode && currentNews) {
      await updateNews();
    } else {
      await createNews();
      setIsModalOpen(false);
    }
    setNewsData({ ...initialState, date: toInputDate(new Date()) });
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
            setNewsData({ ...initialState, date: toInputDate(new Date()) });
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
          <form onSubmit={handleSubmit}>
            <div className="modal-section">
              <h3>Заголовок</h3>
              <input
                type="text"
                name="title"
                value={newsData.title}
                onChange={handleInputChange}
                className="modal-input"
                required
              />
            </div>

            <div className="modal-section">
              <h3>Описание</h3>
              <ReactQuill
                value={newsData.content}
                onChange={(value) =>
                  setNewsData((prev) => ({ ...prev, content: value }))
                }
                theme="snow"
                className="modal-textarea"
              />
            </div>

            <div className="modal-section">
              <h3>Дата</h3>
              <input
                type="datetime-local"
                name="date"
                value={newsData.date}
                onChange={(e) =>
                  setNewsData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="modal-input"
                required
              />
            </div>

            <div className="modal-section">
              <h3>Статус</h3>
              <select
                name="status"
                value={newsData.status}
                onChange={handleInputChange}
                className="modal-input"
                required
              >
                <option value="active">Активный</option>
                <option value="completed">Завершённый</option>
              </select>
            </div>

            <div className="modal-section">
              <h3>Превью</h3>
              {newsData.previewImage ? (
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <img
                    src={URL.createObjectURL(newsData.previewImage)}
                    alt="preview"
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewsData((prev) => ({ ...prev, previewImage: null }))
                    }
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
                    onChange={(e) =>
                      setNewsData((prev) => ({
                        ...prev,
                        previewImage: e.target.files?.[0] || null,
                      }))
                    }
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
