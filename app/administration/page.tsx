"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DocumentItem = {
  id: string;
  document_type: string | null;
  sender: string | null;
  subject: string | null;
  summary: string | null;
  importance: string | null;
  created_at: string;
};

type DeadlineItem = {
  id: string;
  deadline_date: string | null;
  description: string;
  importance: string | null;
  completed: boolean;
  deadline_type: string | null;
  relative_description: string | null;
  received_date: string | null;
  calculated_deadline_date: string | null;
};

type PaymentItem = {
  id: string;
  amount: number | null;
  currency: string | null;
  due_date: string | null;
  recipient: string | null;
  payment_reference: string | null;
  completed: boolean;
};

type AppointmentItem = {
  id: string;
  organization: string | null;
  appointment_date: string | null;
  description: string | null;
  official_url: string | null;
  completed: boolean;
};

export default function AdministrationPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [deadlines, setDeadlines] =
    useState<DeadlineItem[]>([]);

  const [payments, setPayments] =
    useState<PaymentItem[]>([]);

  const [appointments, setAppointments] =
    useState<AppointmentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedDeadline, setSelectedDeadline] =
    useState<DeadlineItem | null>(null);

  const [receivedDate, setReceivedDate] =
    useState("");

  const [calculatedDate, setCalculatedDate] =
    useState("");

  const [savingDeadline, setSavingDeadline] =
    useState(false);

  const [deadlineMessage, setDeadlineMessage] =
    useState("");

  useEffect(() => {
    loadAdministration();
  }, []);

  async function loadAdministration() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your session could not be found. Please return to the scanner and try again."
        );
        return;
      }

      const userId = session.user.id;

      const [
        documentsResponse,
        deadlinesResponse,
        paymentsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        supabase
          .from("documents")
          .select(
            "id, document_type, sender, subject, summary, importance, created_at"
          )
          .eq("user_id", userId)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("deadlines")
          .select(
            "id, deadline_date, calculated_deadline_date, received_date, deadline_type, relative_description, description, importance, completed"
          )
          .eq("user_id", userId)
          .order("deadline_date", {
            ascending: true,
            nullsFirst: false,
          }),

        supabase
          .from("payments")
          .select(
            "id, amount, currency, due_date, recipient, payment_reference, completed"
          )
          .eq("user_id", userId)
          .order("due_date", {
            ascending: true,
            nullsFirst: false,
          }),

        supabase
          .from("appointments")
          .select(
            "id, organization, appointment_date, description, official_url, completed"
          )
          .eq("user_id", userId)
          .order("appointment_date", {
            ascending: true,
            nullsFirst: false,
          }),
      ]);

      if (documentsResponse.error) {
        throw documentsResponse.error;
      }

      if (deadlinesResponse.error) {
        throw deadlinesResponse.error;
      }

      if (paymentsResponse.error) {
        throw paymentsResponse.error;
      }

      if (appointmentsResponse.error) {
        throw appointmentsResponse.error;
      }

      setDocuments(
        (documentsResponse.data ||
          []) as DocumentItem[]
      );

      setDeadlines(
        (deadlinesResponse.data ||
          []) as DeadlineItem[]
      );

      setPayments(
        (paymentsResponse.data ||
          []) as PaymentItem[]
      );

      setAppointments(
        (appointmentsResponse.data ||
          []) as AppointmentItem[]
      );
    } catch (err) {
      console.error(
        "Administration loading error:",
        err
      );

      setError(
        "We could not load your administration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(
    dateString: string | null
  ) {
    if (!dateString) {
      return "No date specified";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatDateTime(
    dateString: string | null
  ) {
    if (!dateString) {
      return "Date not specified";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getDaysUntil(
    dateString: string
  ) {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const date = new Date(dateString);

    date.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      date.getTime() -
      today.getTime();

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }

  function getDeadlineStatus(
    dateString: string | null,
    completed: boolean
  ) {
    if (completed) {
      return {
        label: "Completed",
        className:
          "bg-green-100 text-green-700",
      };
    }

    if (!dateString) {
      return {
        label: "Date needed",
        className:
          "bg-orange-100 text-orange-700",
      };
    }

    const days =
      getDaysUntil(dateString);

    if (days < 0) {
      return {
        label: "Overdue",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (days === 0) {
      return {
        label: "Due today",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (days <= 3) {
      return {
        label: `${days} day${
          days === 1 ? "" : "s"
        } left`,
        className:
          "bg-orange-100 text-orange-700",
      };
    }

    if (days <= 7) {
      return {
        label: `${days} days left`,
        className:
          "bg-orange-100 text-orange-700",
      };
    }

    return {
      label: `${days} days left`,
      className:
        "bg-blue-100 text-blue-700",
    };
  }

  function extractNumberOfDays(
    text: string
  ) {
    const match =
      text.match(
        /(\d+)\s*(day|days|dagen|week|weeks|weken)/i
      );

    if (!match) {
      return null;
    }

    const number =
      Number(match[1]);

    if (
      !Number.isFinite(number)
    ) {
      return null;
    }

    const unit =
      match[2].toLowerCase();

    if (
      unit === "week" ||
      unit === "weeks" ||
      unit === "weken"
    ) {
      return number * 7;
    }

    return number;
  }

  function isRelativeDeadline(
    deadline: DeadlineItem
  ) {
    if (
      deadline.calculated_deadline_date
    ) {
      return false;
    }

    if (deadline.deadline_date) {
      return false;
    }

    if (
      deadline.deadline_type ===
      "relative"
    ) {
      return true;
    }

    const text =
      `${deadline.relative_description || ""} ${deadline.description || ""}`;

    return Boolean(
      extractNumberOfDays(text)
    );
  }

  function openDeadlineCalculator(
    deadline: DeadlineItem
  ) {
    setSelectedDeadline(deadline);

    setReceivedDate(
      deadline.received_date || ""
    );

    setCalculatedDate(
      deadline.calculated_deadline_date ||
        ""
    );

    setDeadlineMessage("");
  }

  function closeDeadlineCalculator() {
    if (savingDeadline) {
      return;
    }

    setSelectedDeadline(null);
    setReceivedDate("");
    setCalculatedDate("");
    setDeadlineMessage("");
  }

  function calculateDeadline() {
    if (!selectedDeadline) {
      return;
    }

    if (!receivedDate) {
      setDeadlineMessage(
        "Please enter the date you received this letter."
      );
      return;
    }

    const text =
      selectedDeadline.relative_description ||
      selectedDeadline.description ||
      "";

    const days =
      extractNumberOfDays(text);

    if (!days) {
      setDeadlineMessage(
        "We could not determine the number of days from this deadline."
      );
      return;
    }

    const baseDate =
      new Date(
        `${receivedDate}T00:00:00`
      );

    if (
      Number.isNaN(
        baseDate.getTime()
      )
    ) {
      setDeadlineMessage(
        "Please enter a valid date."
      );
      return;
    }

    baseDate.setDate(
      baseDate.getDate() + days
    );

    const year =
      baseDate.getFullYear();

    const month =
      String(
        baseDate.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        baseDate.getDate()
      ).padStart(2, "0");

    const result =
      `${year}-${month}-${day}`;

    setCalculatedDate(result);
    setDeadlineMessage("");
  }

  async function saveCalculatedDeadline() {
    if (!selectedDeadline) {
      return;
    }

    if (
      !receivedDate ||
      !calculatedDate
    ) {
      setDeadlineMessage(
        "Please enter the received date and calculate the deadline first."
      );
      return;
    }

    try {
      setSavingDeadline(true);
      setDeadlineMessage("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setDeadlineMessage(
          "Your session could not be found. Please try again."
        );
        return;
      }

      const userId =
        session.user.id;

      const {
        data,
        error: updateError,
      } = await supabase
        .from("deadlines")
        .update({
          received_date:
            receivedDate,

          calculated_deadline_date:
            calculatedDate,

          deadline_date:
            calculatedDate,

          deadline_type:
            "exact",
        })
        .eq(
          "id",
          selectedDeadline.id
        )
        .eq(
          "user_id",
          userId
        )
        .select()
        .single();

      if (updateError) {
        console.error(
          "Deadline update error:",
          updateError
        );

        setDeadlineMessage(
          "We could not save your calculated deadline. Please try again."
        );

        return;
      }

      if (!data) {
        setDeadlineMessage(
          "The deadline could not be updated. Please try again."
        );

        return;
      }

      setDeadlines(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              selectedDeadline.id
                ? {
                    ...item,
                    received_date:
                      receivedDate,
                    calculated_deadline_date:
                      calculatedDate,
                    deadline_date:
                      calculatedDate,
                    deadline_type:
                      "exact",
                  }
                : item
          )
      );

      closeDeadlineCalculator();
    } catch (err) {
      console.error(
        "Deadline calculation save error:",
        err
      );

      setDeadlineMessage(
        "Something went wrong while saving the deadline."
      );
    } finally {
      setSavingDeadline(false);
    }
  }

  const activeDeadlines =
    deadlines.filter(
      (item) =>
        !item.completed
    );

  const activePayments =
    payments.filter(
      (item) =>
        !item.completed
    );

  const activeAppointments =
    appointments.filter(
      (item) =>
        !item.completed
    );

  // Only deadlines with an actual date can be
  // considered "upcoming within 7 days".
  const urgentDeadlines =
    activeDeadlines.filter(
      (item) => {
        if (
          !item.deadline_date
        ) {
          return false;
        }

        return (
          getDaysUntil(
            item.deadline_date
          ) <= 7
        );
      }
    );

  const deadlinesNeedingDate =
    activeDeadlines.filter(
      (item) =>
        !item.deadline_date &&
        isRelativeDeadline(item)
    );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            🇳🇱 Netherlands Guide
          </a>

          <a
            href="/scanner"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            🤖 Scan a letter
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-200">
            Netherlands Guide AI
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            📋 My Administration
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-purple-100">
            All your important letters, deadlines,
            payments and appointments in one place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
            <div className="text-4xl">
              ⏳
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Loading your administration...
            </h2>

            <p className="mt-2 text-slate-500">
              We are securely retrieving your information.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-4xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-800">
              Something went wrong
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadAdministration
              }
              className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Overview cards */}
            <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">
                    📄
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Documents
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">
                  {documents.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Saved letters
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">
                    ⏰
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    Deadlines
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">
                  {activeDeadlines.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Still to complete
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">
                    💶
                  </span>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Payments
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">
                  {activePayments.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Payments to handle
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">
                    📅
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Appointments
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">
                  {activeAppointments.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Upcoming appointments
                </p>
              </div>
            </section>

            {/* Urgent area */}
            {urgentDeadlines.length > 0 && (
              <section className="mt-10">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      🚨
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-red-900">
                        You have upcoming deadlines
                      </h2>

                      <p className="mt-1 text-sm text-red-700">
                        {
                          urgentDeadlines.length
                        }{" "}
                        deadline
                        {urgentDeadlines.length ===
                        1
                          ? ""
                          : "s"}{" "}
                        require attention within the next 7 days.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Deadlines needing a received date */}
            {deadlinesNeedingDate.length > 0 && (
              <section className="mt-10">
                <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      📅
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-orange-900">
                        Some deadlines need a date
                      </h2>

                      <p className="mt-1 text-sm text-orange-800">
                        {
                          deadlinesNeedingDate.length
                        }{" "}
                        deadline
                        {deadlinesNeedingDate.length ===
                        1
                          ? ""
                          : "s"}{" "}
                        depend
                        {deadlinesNeedingDate.length ===
                        1
                          ? "s"
                          : ""}{" "}
                        on when you received the letter.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Deadlines */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  ⏰ Deadlines
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Important dates extracted from your letters.
                </p>
              </div>

              {deadlines.length ===
              0 ? (
                <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
                  <div className="text-4xl">
                    🎉
                  </div>

                  <h3 className="mt-3 font-bold">
                    No deadlines yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Scan a government or official letter and important deadlines will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deadlines.map(
                    (deadline) => {
                      const hasDate =
                        Boolean(
                          deadline.deadline_date
                        );

                      const relative =
                        isRelativeDeadline(
                          deadline
                        );

                      const status =
                        getDeadlineStatus(
                          deadline.deadline_date,
                          deadline.completed
                        );

                      return (
                        <div
                          key={
                            deadline.id
                          }
                          className="rounded-3xl border bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg">
                                  📌
                                </span>

                                <h3 className="font-bold">
                                  {
                                    deadline.description
                                  }
                                </h3>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                                >
                                  {
                                    status.label
                                  }
                                </span>
                              </div>

                              {relative &&
                              !hasDate ? (
                                <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                                  <p className="text-sm font-semibold text-orange-900">
                                    📅 This deadline depends on when you received the letter.
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-orange-800">
                                    {deadline.relative_description ||
                                      deadline.description}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeadlineCalculator(
                                        deadline
                                      )
                                    }
                                    className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                                  >
                                    📅 I received this letter
                                  </button>
                                </div>
                              ) : (
                                <p className="mt-2 text-sm text-slate-500">
                                  Deadline:{" "}
                                  <strong className="text-slate-700">
                                    {formatDate(
                                      deadline.deadline_date
                                    )}
                                  </strong>
                                </p>
                              )}

                              {deadline.received_date &&
                                deadline.calculated_deadline_date && (
                                  <p className="mt-2 text-xs text-slate-400">
                                    Received:{" "}
                                    {formatDate(
                                      deadline.received_date
                                    )}
                                  </p>
                                )}
                            </div>

                            {hasDate &&
                              !deadline.completed && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openDeadlineCalculator(
                                      deadline
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  View deadline
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>

            {/* Payments */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  💶 Payments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Payment obligations found in your documents.
                </p>
              </div>

              {payments.length ===
              0 ? (
                <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
                  <div className="text-4xl">
                    💚
                  </div>

                  <h3 className="mt-3 font-bold">
                    No payments recorded
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    When a letter contains a payment obligation, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {payments.map(
                    (payment) => (
                      <div
                        key={
                          payment.id
                        }
                        className="rounded-3xl border bg-white p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-500">
                              Payment to
                            </p>

                            <h3 className="mt-1 text-xl font-bold">
                              {payment.recipient ||
                                "Recipient not specified"}
                            </h3>
                          </div>

                          <span className="text-3xl">
                            💶
                          </span>
                        </div>

                        <div className="mt-6">
                          <p className="text-3xl font-bold">
                            {payment.amount !==
                            null
                              ? `€${Number(
                                  payment.amount
                                ).toLocaleString(
                                  "en-GB",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}`
                              : "Amount not specified"}
                          </p>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <p>
                            <span className="text-slate-500">
                              Due date:
                            </span>{" "}
                            <strong>
                              {formatDate(
                                payment.due_date
                              )}
                            </strong>
                          </p>

                          {payment.payment_reference && (
                            <p>
                              <span className="text-slate-500">
                                Reference:
                              </span>{" "}
                              <strong>
                                {
                                  payment.payment_reference
                                }
                              </strong>
                            </p>
                          )}
                        </div>

                        <div className="mt-5">
                          {payment.completed ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                              Payment not completed
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Appointments */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  📅 Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Appointments identified from your documents.
                </p>
              </div>

              {appointments.length ===
              0 ? (
                <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
                  <div className="text-4xl">
                    📅
                  </div>

                  <h3 className="mt-3 font-bold">
                    No appointments recorded
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Appointment information from scanned documents will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(
                    (appointment) => (
                      <div
                        key={
                          appointment.id
                        }
                        className="rounded-3xl border bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">
                                📅
                              </span>

                              <div>
                                <h3 className="text-xl font-bold">
                                  {appointment.organization ||
                                    "Appointment"}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  {formatDateTime(
                                    appointment.appointment_date
                                  )}
                                </p>
                              </div>
                            </div>

                            {appointment.description && (
                              <p className="mt-4 text-sm leading-6 text-slate-600">
                                {
                                  appointment.description
                                }
                              </p>
                            )}
                          </div>

                          {appointment.official_url && (
                            <a
                              href={
                                appointment.official_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-700"
                            >
                              Open official website
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Documents */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  📄 Recent Documents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Letters you have scanned with Netherlands Guide.
                </p>
              </div>

              {documents.length ===
              0 ? (
                <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
                  <div className="text-4xl">
                    📄
                  </div>

                  <h3 className="mt-3 font-bold">
                    No documents yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your scanned letters will appear here.
                  </p>

                  <a
                    href="/scanner"
                    className="mt-5 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                  >
                    Scan your first letter
                  </a>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {documents.map(
                    (document) => (
                      <div
                        key={
                          document.id
                        }
                        className="rounded-3xl border bg-white p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              {document.document_type ||
                                "Document"}
                            </span>

                            <h3 className="mt-4 text-lg font-bold">
                              {document.subject ||
                                "No subject identified"}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                              From:{" "}
                              {document.sender ||
                                "Unknown sender"}
                            </p>
                          </div>

                          <span className="text-2xl">
                            📄
                          </span>
                        </div>

                        {document.summary && (
                          <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                            {
                              document.summary
                            }
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            Scanned{" "}
                            {formatDate(
                              document.created_at
                            )}
                          </span>

                          {document.importance && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {
                                document.importance
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Bottom CTA */}
            <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white shadow-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-purple-200">
                    Netherlands Guide AI
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Got another letter?
                  </h2>

                  <p className="mt-2 max-w-xl text-purple-100">
                    Scan it and let Netherlands Guide explain what it means and what you need to do.
                  </p>
                </div>

                <a
                  href="/scanner"
                  className="rounded-xl bg-white px-6 py-3 text-center font-bold text-purple-700 shadow-sm hover:bg-purple-50"
                >
                  🤖 Scan a letter
                </a>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Deadline calculator modal */}
      {selectedDeadline &&
        isRelativeDeadline(
          selectedDeadline
        ) &&
        !selectedDeadline.deadline_date && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
            onClick={closeDeadlineCalculator}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                    Smart deadline
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    When did you receive this letter?
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeDeadlineCalculator
                  }
                  disabled={
                    savingDeadline
                  }
                  className="rounded-full px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-900">
                  Deadline from the letter
                </p>

                <p className="mt-2 text-sm leading-6 text-orange-800">
                  {selectedDeadline.relative_description ||
                    selectedDeadline.description}
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="received-date"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Date received
                </label>

                <input
                  id="received-date"
                  type="date"
                  value={
                    receivedDate
                  }
                  onChange={(event) => {
                    setReceivedDate(
                      event.target.value
                    );
                    setCalculatedDate(
                      ""
                    );
                    setDeadlineMessage(
                      ""
                    );
                  }}
                  disabled={
                    savingDeadline
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {calculatedDate && (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-semibold text-green-800">
                    Calculated deadline
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatDate(
                      calculatedDate
                    )}
                  </p>
                </div>
              )}

              {deadlineMessage && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                  {deadlineMessage}
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeDeadlineCalculator
                  }
                  disabled={
                    savingDeadline
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    calculatedDate
                      ? saveCalculatedDeadline
                      : calculateDeadline
                  }
                  disabled={
                    savingDeadline
                  }
                  className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingDeadline
                    ? "Saving..."
                    : calculatedDate
                    ? "✓ Save deadline"
                    : "🧮 Calculate deadline"}
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}