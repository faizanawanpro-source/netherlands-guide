import { supabase } from "@/lib/supabase";

export type NotificationPriority = "high" | "medium" | "normal";

export type CreateNotificationInput = {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actionUrl?: string | null;
  relatedId?: string | null;
  relatedType?: string | null;
  scheduledFor?: string | null;
};

export async function createNotification(
  notification: CreateNotificationInput
) {
  const {
    userId,
    type,
    title,
    message,
    priority = "normal",
    actionUrl = null,
    relatedId = null,
    relatedType = null,
    scheduledFor = null,
  } = notification;

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      message,
      priority,
      read: false,
      action_url: actionUrl,
      related_id: relatedId,
      related_type: relatedType,
      scheduled_for: scheduledFor,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }

  return data;
}

export async function createNotifications(
  notifications: CreateNotificationInput[]
) {
  if (notifications.length === 0) {
    return [];
  }

  const rows = notifications.map((notification) => ({
    user_id: notification.userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    priority: notification.priority ?? "normal",
    read: false,
    action_url: notification.actionUrl ?? null,
    related_id: notification.relatedId ?? null,
    related_type: notification.relatedType ?? null,
    scheduled_for: notification.scheduledFor ?? null,
  }));

  const { data, error } = await supabase
    .from("notifications")
    .insert(rows)
    .select();

  if (error) {
    console.error("Failed to create notifications:", error);
    throw error;
  }

  return data ?? [];
}

export async function getUnreadNotificationCount(userId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
}
