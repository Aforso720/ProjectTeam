import React, { useState, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import './Notisfaction.scss'

const Notisfaction = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
  const [localNotifications, setLocalNotifications] = useState([])

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const handleNotificationClick = async (notification) => {
    if (notification.read_at === null) {
      await markAsRead(notification.id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 1) return 'только что'
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`
    if (diffHours < 24) return `${diffHours} ч. назад`
    if (diffDays < 7) return `${diffDays} дн. назад`
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getNotificationIcon = (type) => {
    if (type.includes('ProjectCreatedNotification')) {
      return '📋'
    } else if (type.includes('Approval')) {
      return '✅'
    } else if (type.includes('Rejection')) {
      return '❌'
    }
    return '🔔'
  }

  const getNotificationType = (type) => {
    if (type.includes('ProjectCreatedNotification')) {
      return 'Новый проект'
    } else if (type.includes('Approval')) {
      return 'Одобрение'
    } else if (type.includes('Rejection')) {
      return 'Отклонение'
    }
    return 'Уведомление'
  }

  if (loading) {
    return (
      <section className='notisfaction'>
        <div className="notisfaction-header">
          <h1>Уведомления</h1>
        </div>
        <div className="notisfaction-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка уведомлений...</p>
        </div>
      </section>
    )
  }

  return (
    <section className='notisfaction'>
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
            {localNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-card ${notification.read_at ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-type">
                      {getNotificationType(notification.type)}
                    </span>
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  <p className="notification-message">
                    {notification.data?.message || 'Новое уведомление'}
                  </p>

                  {notification.data?.project_name && (
                    <div className="notification-details">
                      <p><strong>Проект:</strong> {notification.data.project_name}</p>
                      {notification.data?.user?.name && (
                        <p><strong>Пользователь:</strong> {notification.data.user.name}</p>
                      )}
                    </div>
                  )}

                  {notification.read_at === null && (
                    <div className="unread-indicator">
                      <span className="dot"></span>
                      Новое
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Notisfaction