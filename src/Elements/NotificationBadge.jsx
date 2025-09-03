import React from 'react'
import { useNotifications } from '../context/NotificationContext'


const NotificationBadge = () => {
  const { unreadCount } = useNotifications()

  if (unreadCount === 0) return null

  const displayCount = unreadCount > 99 ? '99+' : unreadCount

  return (
    <span className="notification-badge">
      {displayCount}
    </span>
  )
}

export default NotificationBadge