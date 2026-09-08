"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  CalendarDays,
  CreditCard,
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "normal" | string;
  read: boolean;
  action_url: string | null;
  related_id: string | null;
  related_type: string | null;
  scheduled_for: string | null;
  created_at: string;
};

function getNotificationIcon(type: string) {
  switch (type) {
    case "deadline":
      return CalendarDays;

    case "payment":
      return CreditCard;

    case "appointment":
      return CalendarDays;

    case "document":
      return FileText;

    case "warning":
      return AlertTriangle;

    default:
      return Bell;
  }
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50";

    case "medium":
      return "border-orange-200 bg-orange-50";

    default:
      return "border-slate-200 bg-white";
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "high":
      return "Important";

    case "medium":
      return "Reminder";

    default:
      return "Notification";
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setNotifications([]);
        return;
      }

      const { data, error: notificationsError } = await supabase
        .from("notifications")
        .select(
          "id, type, title, message, priority, read, action_url, related_id, related_type, scheduled_for, created_at"
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (notificationsError) {
        throw notificationsError;
      }

      setNotifications((data as Notification[]) ?? []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Could not load your notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAsRead(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const { error: updateError } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (updateError) {
      console.error("Failed to mark notification as read:", updateError);
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  async function markAllAsRead() {
    try {
      setMarkingAll(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", session.user.id)
        .eq("read", false);

      if (updateError) {
        throw updateError;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError("Could not mark all notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  }

  async function deleteNotification(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { error: deleteError } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (deleteError) {
        throw deleteError;
      }

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
      setError("Could not delete the notification.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck className="h-4 w-4" />
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Bell className="h-4 w-4" />
                Notifications
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                Stay on top of what matters
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                Deadlines, payments, appointments and important updates from
                your Netherlands journey.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-white/15 p-4 backdrop-blur sm:block">
              <Bell className="h-10 w-10" />
            </div>
          </div>

          <div className="mt-7 inline-flex rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur">
            {unreadCount === 0
              ? "You're all caught up"
              : `${unreadCount} unread ${
                  unreadCount === 1 ? "notification" : "notifications"
                }`}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Notifications */}
        <section className="mt-8">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Bell className="h-8 w-8 text-indigo-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No notifications yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When Netherway finds an important deadline, payment,
                appointment or update, it will appear here.
              </p>

              <Link
                href="/scanner"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <FileText className="h-4 w-4" />
                Scan a letter
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                const content = (
                  <div
                    className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm transition sm:p-6 ${
                      getPriorityClasses(notification.priority)
                    } ${
                      !notification.read
                        ? "ring-2 ring-indigo-100"
                        : ""
                    }`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600" />
                    )}

                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          notification.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : notification.priority === "medium"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-bold text-slate-900">
                                {notification.title}
                              </h2>

                              {!notification.read && (
                                <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
                                  NEW
                                </span>
                              )}
                            </div>

                            <span className="mt-1 block text-xs font-semibold text-slate-500">
                              {getPriorityLabel(notification.priority)} ·{" "}
                              {formatDate(notification.created_at)}
                            </span>
                          </div>

                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            disabled={deletingId === notification.id}
                            className="self-start rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-red-600 disabled:opacity-50"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {notification.message}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {!notification.read && (
                            <button
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                            >
                              <Check className="h-4 w-4" />
                              Mark as read
                            </button>
                          )}

                          {notification.action_url && (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                              Open
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                if (notification.action_url) {
                  return (
                    <Link
                      key={notification.id}
                      href={notification.action_url}
                      onClick={() => handleNotificationClick(notification)}
                      className="block"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={notification.id} onClick={() => handleNotificationClick(notification)}>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Helpful links */}
        {!loading && notifications.length > 0 && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/administration"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <FileText className="h-7 w-7 text-indigo-600" />
              <h3 className="mt-4 font-bold text-slate-900">
                Open Administration
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                View your letters, deadlines, payments and appointments.
              </p>
            </Link>

            <Link
              href="/scanner"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Info className="h-7 w-7 text-indigo-600" />
              <h3 className="mt-4 font-bold text-slate-900">
                Scan another letter
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Let Netherway understand a new Dutch letter for you.
              </p>
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
