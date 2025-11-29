import React, { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import "./Notisfaction.scss";
import axiosInstance from "../../API/axiosInstance";

const Notisfaction = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const [localNotifications, setLocalNotifications] = useState([]);
  const [submitting, setSubmitting] = useState({}); // { [id]: boolean }
  const [actionDone, setActionDone] = useState({}); // { [id]: boolean }
  const [errorById, setErrorById] = useState({});   // { [id]: string | undefined }
  const [fileById, setFileById] = useState({});     // { [id]: File | undefined }

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleNotificationClick = async (notification) => {
    if (notification.read_at === null) {
      await markAsRead(notification.id);
      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "только что";
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getNotificationIcon = (type) => {
    if (type.includes("ProjectCreatedNotification")) return "📋";
    if (type.includes("Approval")) return "✅";
    if (type.includes("Rejection")) return "❌";
    return "🔔";
  };

  const getNotificationType = (type) => {
    if (type.includes("ProjectCreatedNotification")) return "Новый проект";
    if (type.includes("Approval")) return "Одобрение";
    if (type.includes("Rejection")) return "Отклонение";
    return "Уведомление";
  };

  const isCertificateAction = (n) =>
    n?.data?.action && n.data.action.includes("/upload-certificate");

  // Принудительно меняем протокол на https
  const toHttps = (rawUrl) => {
    if (!rawUrl) return rawUrl;
    try {
      const cleaned = String(rawUrl).replace(/\\\//g, "/");
      const url = new URL(cleaned, typeof window !== "undefined" ? window.location.origin : undefined);
      if (url.protocol === "http:") url.protocol = "https:";
      return url.toString();
    } catch {
      return String(rawUrl).replace(/^http:\/\//i, "https://");
    }
  };

  // выбор файла для конкретного уведомления
  const handleFileChange = (id, file) => {
    setFileById((p) => ({ ...p, [id]: file || undefined }));
    // при новой попытке — очищаем ошибку
    setErrorById((p) => ({ ...p, [id]: undefined }));
  };

  const handleActionClick = async (e, notification) => {
    e.stopPropagation();
    const id = notification.id;
    const actionUrl = notification?.data?.action;
    if (!actionUrl) return;

    const file = fileById[id];
    if (!file) {
      setErrorById((p) => ({ ...p, [id]: "Выберите файл сертификата." }));
      return;
    }

    // Пример быстрой клиентской валидации (необязательно)
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (file.type && !allowed.includes(file.type)) {
      setErrorById((p) => ({ ...p, [id]: "Допустимы PDF/JPG/PNG." }));
      return;
    }
    // допустим лимит 10 МБ
    const TEN_MB = 10 * 1024 * 1024;
    if (file.size > TEN_MB) {
      setErrorById((p) => ({ ...p, [id]: "Файл больше 10 МБ." }));
      return;
    }

    try {
      setErrorById((p) => ({ ...p, [id]: undefined }));
      setSubmitting((p) => ({ ...p, [id]: true }));

      const secureUrl = toHttps(actionUrl);

      const fd = new FormData();
      fd.append("certificate", file); // <-- ключ, которого требовал бэкенд
      // второе поле: project_id (берём из notification.data.project_id)
      if (notification?.data?.project_id != null) {
        fd.append("project_id", String(notification.data.project_id));
      }

      await axiosInstance.post(secureUrl, fd);

      if (notification.read_at === null) {
        await markAsRead(id);
      }

      setActionDone((p) => ({ ...p, [id]: true }));
      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n
        )
      );

      // очистить выбранный файл
      setFileById((p) => ({ ...p, [id]: undefined }));
    } catch (err) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.errors?.certificate?.[0] ||
        err?.response?.data?.message;
      setErrorById((p) => ({
        ...p,
        [id]: serverMsg || "Не удалось выполнить действие. Повторите попытку.",
      }));
    } finally {
      setSubmitting((p) => ({ ...p, [id]: false }));
    }
  };

  if (loading) {
    return (
      <section className="notisfaction">
        <div className="notisfaction-header">
          <h1>Уведомления</h1>
        </div>
        <div className="notisfaction-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка уведомлений...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="notisfaction">
      {localNotifications.length !== 0 ? (
        <div className="notisfaction-header">
          <h1>Уведомления</h1>
          {unreadCount > 0 && (
            <button
              className="mark-all-read-btn"
              onClick={markAllAsRead}
              title="Отметить все как прочитанные"
            >
              Отметить все прочитанными
            </button>
          )}
        </div>
      ) : null}

      {localNotifications.length === 0 ? (
        <div className="no-notifications">
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>Нет уведомлений</h3>
            <p>Здесь будут появляться важные уведомления</p>
          </div>
        </div>
      ) : (
        <>
          <div className="notifications-stats">
            <span className="total-count">Всего: {localNotifications.length}</span>
            {unreadCount > 0 && (
              <span className="unread-count">Непрочитанных: {unreadCount}</span>
            )}
          </div>

          <div className="notifications-list">
            {localNotifications.map((notification) => {
              const id = notification.id;
              const showCertBtn = isCertificateAction(notification);
              const isBusy = !!submitting[id];
              const isDone = !!actionDone[id];

              return (
                <div
                  key={id}
                  className={`notification-card ${notification.read_at ? "read" : "unread"}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">{getNotificationIcon(notification.type)}</div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <span className="notification-type">{getNotificationType(notification.type)}</span>
                      <span className="notification-date">{formatDate(notification.created_at)}</span>
                    </div>

                    <p className="notification-message">
                      {notification.data?.message || "Новое уведомление"}
                    </p>

                    {notification.data?.project_name && (
                      <div className="notification-details">
                        <p>
                          <strong>Проект:</strong> {notification.data.project_name}
                        </p>
                      </div>
                    )}

                    {(showCertBtn || notification.data?.project_url) && (
                      <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                        {showCertBtn && (
                          <>
                            <label className="file-picker">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(ev) => handleFileChange(id, ev.target.files?.[0])}
                              />
                              <span>
                                {fileById[id]?.name
                                  ? `Выбрано: ${fileById[id].name}`
                                  : "Выбрать файл"}
                              </span>
                            </label>

                            <button
                              className={`action-btn ${isDone ? "success" : ""}`}
                              disabled={isBusy || isDone}
                              onClick={(e) => handleActionClick(e, notification)}
                            >
                              {isBusy ? "Отправка..." : isDone ? "Готово" : "Отправить сертификат"}
                            </button>
                          </>
                        )}

                        {notification.data?.project_url && (
                          <a
                            className="ghost-link"
                            href={notification.data.project_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Открыть проект
                          </a>
                        )}
                      </div>
                    )}

                    {errorById[id] && <div className="action-error">{errorById[id]}</div>}

                    {notification.read_at === null && (
                      <div className="unread-indicator">
                        <span className="dot"></span>
                        Новое
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default Notisfaction;
