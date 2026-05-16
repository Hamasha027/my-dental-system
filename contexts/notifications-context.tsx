'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { preloadNotificationSounds } from '@/lib/notification-sound'
import { registerPushNotificationHandler } from '@/lib/push-notification'

export type NotificationType =
  | 'sale'
  | 'patient'
  | 'sale_delete'
  | 'patient_delete'
  | 'staff'
  | 'staff_delete'
  | 'staff_advance'
  | 'expense'
  | 'expense_delete'
  | 'installment'
  | 'installment_payment'
  | 'installment_delete'
  | 'appointment'
  | 'success'
  | 'error'
  | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50))
  }, [])

  useEffect(() => {
    preloadNotificationSounds()
    registerPushNotificationHandler(addNotification)
    return () => registerPushNotificationHandler(() => {})
  }, [addNotification])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
