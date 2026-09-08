import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ReminderType =
  | "7_days"
  | "3_days"
  | "1_day"
  | "due_today";

type ReminderItemType =
  | "payment"
  | "deadline"
  | "appointment";

function getNetherlandsDateKey(date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dateKeyToUtcDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function getDaysDifference(
  targetDateKey: string,
  todayDateKey: string
) {
  const target = dateKeyToUtcDate(targetDateKey);
  const today = dateKeyToUtcDate(todayDateKey);

  return Math.round(
    (target.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getReminderType(
  daysUntil: number,
  _itemType: ReminderItemType
): ReminderType | null {
  if (daysUntil === 7) return "7_days";
  if (daysUntil === 3) return "3_days";
  if (daysUntil === 1) return "1_day";
  if (daysUntil === 0) return "due_today";

  return null;
}

function getReminderTitle(
  itemType: ReminderItemType,
  reminderType: ReminderType,
  name?: string | null
) {
  const itemName =
    name ||
    (itemType === "payment"
      ? "Payment"
      : itemType === "deadline"
        ? "Deadline"
        : "Appointment");

  if (reminderType === "7_days") {
    return `${itemName} is due in 7 days`;
  }

  if (reminderType === "3_days") {
    return `${itemName} is due in 3 days`;
  }

  if (reminderType === "1_day") {
    return `${itemName} is due tomorrow`;
  }

  return `${itemName} is due today`;
}

function getReminderMessage(
  itemType: ReminderItemType,
  reminderType: ReminderType,
  details: string
) {
  if (reminderType === "7_days") {
    return `You have ${itemType} coming up in 7 days. ${details}`;
  }

  if (reminderType === "3_days") {
    return `You have ${itemType} coming up in 3 days. ${details}`;
  }

  if (reminderType === "1_day") {
    return `Your ${itemType} is due tomorrow. ${details}`;
  }

  return `Your ${itemType} is due today. ${details}`;
}

export async function GET(request: Request) {
  try {
    /*
     * ------------------------------------------------------------
     * SECURITY
     * ------------------------------------------------------------
     */

    const authHeader = request.headers.get("authorization");

    const cronSecret = process.env.CRON_SECRET;
    const reminderSecret = process.env.REMINDER_SECRET;

    const expectedSecret =
      cronSecret ?? reminderSecret;

    if (!expectedSecret) {
      console.error(
        "Reminder job cannot run because no cron secret is configured."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Reminder service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * SUPABASE CONFIGURATION
     * ------------------------------------------------------------
     */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      console.error(
        "Reminder job cannot run because Supabase server configuration is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Reminder service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * SUPABASE ADMIN CLIENT
     * ------------------------------------------------------------
     */

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * ------------------------------------------------------------
     * DATE
     * ------------------------------------------------------------
     */

    const today = getNetherlandsDateKey();

    let remindersCreated = 0;
    let remindersSkipped = 0;

    /*
     * ------------------------------------------------------------
     * PAYMENTS
     * ------------------------------------------------------------
     */

    const {
      data: payments,
      error: paymentsError,
    } = await supabaseAdmin
      .from("payments")
      .select(`
        id,
        user_id,
        amount,
        currency,
        due_date,
        recipient,
        payment_reference,
        completed
      `)
      .eq("completed", false)
      .not("due_date", "is", null);

    if (paymentsError) {
      throw paymentsError;
    }

    for (const payment of payments ?? []) {
      if (!payment.due_date) continue;

      const daysUntil = getDaysDifference(
        payment.due_date,
        today
      );

      const reminderType = getReminderType(
        daysUntil,
        "payment"
      );

      if (!reminderType) continue;

      const {
        data: existingLog,
        error: existingLogError,
      } = await supabaseAdmin
        .from("reminder_logs")
        .select("id")
        .eq("item_type", "payment")
        .eq("item_id", payment.id)
        .eq("reminder_type", reminderType)
        .maybeSingle();

      if (existingLogError) {
        throw existingLogError;
      }

      if (existingLog) {
        remindersSkipped++;
        continue;
      }

      const amountText =
        payment.amount !== null
          ? `${payment.currency || "€"}${payment.amount}`
          : "the payment";

      const recipientText = payment.recipient
        ? `Recipient: ${payment.recipient}.`
        : "";

      const referenceText = payment.payment_reference
        ? ` Payment reference: ${payment.payment_reference}.`
        : "";

      const details =
        `${amountText} is due on ${payment.due_date}. ` +
        `${recipientText}${referenceText}`;

      const title = getReminderTitle(
        "payment",
        reminderType,
        "Payment"
      );

      const message = getReminderMessage(
        "payment",
        reminderType,
        details
      );

      const priority =
        reminderType === "due_today" ||
        reminderType === "1_day"
          ? "high"
          : reminderType === "3_days"
            ? "medium"
            : "normal";

      const {
        data: notification,
        error: notificationError,
      } = await supabaseAdmin
        .from("notifications")
        .insert({
          user_id: payment.user_id,
          type: "payment_reminder",
          title,
          message,
          priority,
          read: false,
          action_url: "/administration",
          related_id: payment.id,
          related_type: "payment",
          scheduled_for: null,
        })
        .select("id")
        .single();

      if (notificationError) {
        throw notificationError;
      }

      const { error: logError } =
        await supabaseAdmin
          .from("reminder_logs")
          .insert({
            user_id: payment.user_id,
            item_type: "payment",
            item_id: payment.id,
            reminder_type: reminderType,
            notification_id: notification.id,
          });

      if (logError) {
        throw logError;
      }

      remindersCreated++;
    }

    /*
     * ------------------------------------------------------------
     * DEADLINES
     * ------------------------------------------------------------
     */

    const {
      data: deadlines,
      error: deadlinesError,
    } = await supabaseAdmin
      .from("deadlines")
      .select(`
        id,
        user_id,
        deadline_date,
        description,
        importance,
        completed
      `)
      .eq("completed", false)
      .not("deadline_date", "is", null);

    if (deadlinesError) {
      throw deadlinesError;
    }

    for (const deadline of deadlines ?? []) {
      if (!deadline.deadline_date) continue;

      const daysUntil = getDaysDifference(
        deadline.deadline_date,
        today
      );

      const reminderType = getReminderType(
        daysUntil,
        "deadline"
      );

      if (!reminderType) continue;

      const {
        data: existingLog,
        error: existingLogError,
      } = await supabaseAdmin
        .from("reminder_logs")
        .select("id")
        .eq("item_type", "deadline")
        .eq("item_id", deadline.id)
        .eq("reminder_type", reminderType)
        .maybeSingle();

      if (existingLogError) {
        throw existingLogError;
      }

      if (existingLog) {
        remindersSkipped++;
        continue;
      }

      const description =
        deadline.description ||
        "You have an upcoming deadline.";

      const importanceText =
        deadline.importance
          ? ` Importance: ${deadline.importance}.`
          : "";

      const details =
        `${description} Deadline date: ${deadline.deadline_date}.` +
        importanceText;

      const title = getReminderTitle(
        "deadline",
        reminderType,
        "Deadline"
      );

      const message = getReminderMessage(
        "deadline",
        reminderType,
        details
      );

      const priority =
        reminderType === "due_today" ||
        reminderType === "1_day"
          ? "high"
          : reminderType === "3_days"
            ? "medium"
            : "normal";

      const {
        data: notification,
        error: notificationError,
      } = await supabaseAdmin
        .from("notifications")
        .insert({
          user_id: deadline.user_id,
          type: "deadline_reminder",
          title,
          message,
          priority,
          read: false,
          action_url: "/administration",
          related_id: deadline.id,
          related_type: "deadline",
          scheduled_for: null,
        })
        .select("id")
        .single();

      if (notificationError) {
        throw notificationError;
      }

      const { error: logError } =
        await supabaseAdmin
          .from("reminder_logs")
          .insert({
            user_id: deadline.user_id,
            item_type: "deadline",
            item_id: deadline.id,
            reminder_type: reminderType,
            notification_id: notification.id,
          });

      if (logError) {
        throw logError;
      }

      remindersCreated++;
    }

    /*
     * ------------------------------------------------------------
     * APPOINTMENTS
     * ------------------------------------------------------------
     */

    const {
      data: appointments,
      error: appointmentsError,
    } = await supabaseAdmin
      .from("appointments")
      .select(`
        id,
        user_id,
        organization,
        appointment_date,
        description,
        official_url,
        completed
      `)
      .eq("completed", false)
      .not("appointment_date", "is", null);

    if (appointmentsError) {
      throw appointmentsError;
    }

    for (const appointment of appointments ?? []) {
      if (!appointment.appointment_date) continue;

      const appointmentDateKey =
        getNetherlandsDateKey(
          new Date(appointment.appointment_date)
        );

      const daysUntil = getDaysDifference(
        appointmentDateKey,
        today
      );

      if (daysUntil !== 1 && daysUntil !== 0) {
        continue;
      }

      const reminderType: ReminderType =
        daysUntil === 1
          ? "1_day"
          : "due_today";

      const {
        data: existingLog,
        error: existingLogError,
      } = await supabaseAdmin
        .from("reminder_logs")
        .select("id")
        .eq("item_type", "appointment")
        .eq("item_id", appointment.id)
        .eq("reminder_type", reminderType)
        .maybeSingle();

      if (existingLogError) {
        throw existingLogError;
      }

      if (existingLog) {
        remindersSkipped++;
        continue;
      }

      const organization =
        appointment.organization ||
        "Appointment";

      const description =
        appointment.description ||
        "You have an upcoming appointment.";

      const appointmentDate =
        new Date(appointment.appointment_date);

      const formattedTime =
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Amsterdam",
          hour: "2-digit",
          minute: "2-digit",
        }).format(appointmentDate);

      const details =
        `${description} ` +
        `Date: ${appointmentDateKey}. ` +
        `Time: ${formattedTime}.`;

      const title = getReminderTitle(
        "appointment",
        reminderType,
        organization
      );

      const message = getReminderMessage(
        "appointment",
        reminderType,
        details
      );

      const priority =
        reminderType === "due_today"
          ? "high"
          : "medium";

      const {
        data: notification,
        error: notificationError,
      } = await supabaseAdmin
        .from("notifications")
        .insert({
          user_id: appointment.user_id,
          type: "appointment_reminder",
          title,
          message,
          priority,
          read: false,
          action_url: "/administration",
          related_id: appointment.id,
          related_type: "appointment",
          scheduled_for: null,
        })
        .select("id")
        .single();

      if (notificationError) {
        throw notificationError;
      }

      const { error: logError } =
        await supabaseAdmin
          .from("reminder_logs")
          .insert({
            user_id: appointment.user_id,
            item_type: "appointment",
            item_id: appointment.id,
            reminder_type: reminderType,
            notification_id: notification.id,
          });

      if (logError) {
        throw logError;
      }

      remindersCreated++;
    }

    /*
     * ------------------------------------------------------------
     * SUCCESS
     * ------------------------------------------------------------
     */

    return NextResponse.json({
      success: true,
      remindersCreated,
      remindersSkipped,
      checkedAt: new Date().toISOString(),
      netherlandsDate: today,
    });
  } catch (error) {
    console.error("Reminder job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Reminder job failed.",
      },
      {
        status: 500,
      }
    );
  }
}