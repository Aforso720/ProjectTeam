import React, { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../API/axiosInstance'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)

  // Функция для сброса уведомлений при выходе
  const resetNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    setLastChecked(null)
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/notifications')
      setNotifications(response.data.data)
      
      const unread = response.data.data.filter(notif => notif.read_at === null).length
      setUnreadCount(unread)
      
      return response.data.data
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`)
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      return true
    } catch (error) {
      console.error('Ошибка отметки как прочитанного:', error)
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => notif.read_at === null)
      
      const promises = unreadNotifications.map(notif => 
        axiosInstance.patch(`/notifications/${notif.id}/read`)
      )
      
      await Promise.all(promises)
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)
      setLastChecked(new Date())
      
      return true
    } catch (error) {
      console.error('Ошибка отметки всех как прочитанных:', error)
      return false
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    const interval = setInterval(fetchNotifications, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    notifications,
    unreadCount,
    loading,
    lastChecked,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setLastChecked,
    resetNotifications // Добавляем функцию сброса
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}