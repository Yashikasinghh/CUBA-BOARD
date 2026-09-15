import { create } from 'zustand';
import type { Notification, NotificationType } from '@/types';
import { generateId } from '@/lib/utils';
import { NOTIFICATION_DURATION, MAX_NOTIFICATIONS } from '@/lib/constants';

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message: string) => string;
  error: (title: string, message: string) => string;
  warning: (title: string, message: string) => string;
  info: (title: string, message: string) => string;
}

function createShorthand(type: NotificationType) {
  return (
    set: (fn: (state: NotificationState) => Partial<NotificationState>) => void,
    get: () => NotificationState,
    title: string,
    message: string
  ): string => {
    return get().addNotification({
      type,
      title,
      message,
      duration: NOTIFICATION_DURATION,
    });
  };
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? NOTIFICATION_DURATION,
    };

    set((state) => {
      // Keep only the latest notifications up to max
      const updated = [newNotification, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
      return { notifications: updated };
    });

    // Auto-dismiss after duration
    const duration = newNotification.duration;
    if (duration && duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  success: (title: string, message: string) => {
    return createShorthand('success')(set, get, title, message);
  },

  error: (title: string, message: string) => {
    return createShorthand('error')(set, get, title, message);
  },

  warning: (title: string, message: string) => {
    return createShorthand('warning')(set, get, title, message);
  },

  info: (title: string, message: string) => {
    return createShorthand('info')(set, get, title, message);
  },
}));
