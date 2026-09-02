import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeReference(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function parseAmount(value: unknown) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const raw = String(value)
    .trim()
    .replace(/[^\d,.-]/g, "");

  if (!raw) {
    return null;
  }

  let normalized = raw;

  /*
   * Dutch / European:
   * 149,70
   * 1.149,70
   *
   * English:
   * 149.70
   * 1,149.70
   */

  if (
    normalized.includes(",") &&
    normalized.includes(".")
  ) {
    const lastComma =
      normalized.lastIndexOf(",");

    const lastDot =
      normalized.lastIndexOf(".");

    if (lastComma > lastDot) {
      normalized = normalized
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      normalized =
        normalized.replace(/,/g, "");
    }
  } else if (
    normalized.includes(",")
  ) {
    normalized =
      normalized.replace(",", ".");
  }

  const parsed =
    Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function tokenize(value: unknown) {
  return new Set(
    normalizeText(value)
      .split(/\s+/)
      .filter(
        (token) =>
          token.length >= 2
      )
  );
}

function textSimilarity(
  first: unknown,
  second: unknown
) {
  const a = tokenize(first);
  const b = tokenize(second);

  if (
    a.size === 0 ||
    b.size === 0
  ) {
    return 0;
  }

  let shared = 0;

  for (const token of a) {
    if (b.has(token)) {
      shared++;
    }
  }

  const union =
    new Set([
      ...a,
      ...b,
    ]).size;

  if (union === 0) {
    return 0;
  }

  return shared / union;
}

export async function POST(
  request: Request
) {
  try {
    const authorization =
      request.headers.get(
        "authorization"
      );

    if (
      !authorization?.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your session could not be verified. Please try again.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization
        .replace("Bearer ", "")
        .trim();

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabasePublishableKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (
      !supabaseUrl ||
      !supabasePublishableKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        supabasePublishableKey,
        {
          global: {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        }
      );

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      console.error(
        "Supabase user verification error:",
        userError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Your session is no longer valid. Please try again.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const {
      documentType,
      sender,
      subject,
      summary,
      explanation,
      consequences,
      importance,
      replyNeeded,
      appointmentNeeded,
      officialUrl,
      confidence,
      deadlines,
      payments,
      appointments,
      forceSave,
    } = body;

    const userId =
      user.id;

    /*
     * --------------------------------------------------
     * DUPLICATE DETECTION
     * --------------------------------------------------
     *
     * Skip this check when the user explicitly chooses
     * "Save anyway".
     */

    if (!forceSave) {
      const {
        data: existingDocuments,
        error:
          existingDocumentsError,
      } =
        await supabase
          .from("documents")
          .select(
            "id, document_type, sender, subject, summary, created_at"
          )
          .eq(
            "user_id",
            userId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(100);

      if (
        existingDocumentsError
      ) {
        /*
         * Duplicate checking is allowed to fail
         * without blocking a normal save.
         */
        console.error(
          "Duplicate document lookup error:",
          existingDocumentsError
        );
      } else if (
        existingDocuments &&
        existingDocuments.length > 0
      ) {
        const documentIds =
          existingDocuments.map(
            (item) => item.id
          );

        const {
          data: existingPayments,
          error:
            existingPaymentsError,
        } =
          await supabase
            .from("payments")
            .select(
              "id, document_id, amount, currency, recipient, payment_reference"
            )
            .eq(
              "user_id",
              userId
            )
            .in(
              "document_id",
              documentIds
            );

        if (
          existingPaymentsError
        ) {
          console.error(
            "Duplicate payment lookup error:",
            existingPaymentsError
          );
        }

        const newPayments =
          Array.isArray(
            payments
          )
            ? payments
            : [];

        let duplicateDocument:
          | any
          | null = null;

        let duplicateReason =
          "";

        /*
         * 1. PAYMENT REFERENCE
         *
         * This is the strongest duplicate signal.
         */

        for (
          const newPayment of newPayments
        ) {
          const newReference =
            normalizeReference(
              newPayment?.paymentReference
            );

          if (!newReference) {
            continue;
          }

          const matchingPayment =
            (
              existingPayments ||
              []
            ).find(
              (
                existingPayment
              ) =>
                normalizeReference(
                  existingPayment?.payment_reference
                ) ===
                newReference
            );

          if (
            matchingPayment
          ) {
            duplicateDocument =
              existingDocuments.find(
                (document) =>
                  document.id ===
                  matchingPayment.document_id
              );

            if (
              duplicateDocument
            ) {
              duplicateReason =
                "matching payment reference";

              break;
            }
          }
        }

        /*
         * 2. RECIPIENT + AMOUNT
         */

        if (
          !duplicateDocument
        ) {
          for (
            const newPayment of newPayments
          ) {
            const newRecipient =
              normalizeText(
                newPayment?.recipient
              );

            const newAmount =
              parseAmount(
                newPayment?.amount
              );

            if (
              !newRecipient ||
              newAmount === null
            ) {
              continue;
            }

            const matchingPayment =
              (
                existingPayments ||
                []
              ).find(
                (
                  existingPayment
                ) => {
                  const existingRecipient =
                    normalizeText(
                      existingPayment?.recipient
                    );

                  const existingAmount =
                    parseAmount(
                      existingPayment?.amount
                    );

                  if (
                    !existingRecipient ||
                    existingAmount ===
                      null
                  ) {
                    return false;
                  }

                  return (
                    existingRecipient ===
                      newRecipient &&
                    Math.abs(
                      existingAmount -
                        newAmount
                    ) < 0.01
                  );
                }
              );

            if (
              matchingPayment
            ) {
              duplicateDocument =
                existingDocuments.find(
                  (document) =>
                    document.id ===
                    matchingPayment.document_id
                );

              if (
                duplicateDocument
              ) {
                duplicateReason =
                  "matching payment recipient and amount";

                break;
              }
            }
          }
        }

        /*
         * 3. SENDER + SUBJECT
         *
         * Used for letters that don't contain
         * payment information.
         */

        if (
          !duplicateDocument
        ) {
          const newSender =
            normalizeText(
              sender
            );

          const newSubject =
            normalizeText(
              subject
            );

          if (
            newSender &&
            newSubject
          ) {
            for (
              const existingDocument of existingDocuments
            ) {
              const existingSender =
                normalizeText(
                  existingDocument.sender
                );

              const existingSubject =
                normalizeText(
                  existingDocument.subject
                );

              if (
                !existingSender ||
                !existingSubject
              ) {
                continue;
              }

              const senderMatch =
                textSimilarity(
                  newSender,
                  existingSender
                );

              const subjectMatch =
                textSimilarity(
                  newSubject,
                  existingSubject
                );

              if (
                senderMatch >= 0.8 &&
                subjectMatch >= 0.8
              ) {
                duplicateDocument =
                  existingDocument;

                duplicateReason =
                  "matching sender and subject";

                break;
              }
            }
          }
        }

        /*
         * Return duplicate warning.
         */

        if (
          duplicateDocument
        ) {
          return NextResponse.json(
            {
              success: false,
              duplicate: true,

              message:
                "You may have already scanned this letter.",

              duplicateReason,

              existingDocument: {
                id:
                  duplicateDocument.id,

                documentType:
                  duplicateDocument.document_type ||
                  "Official document",

                sender:
                  duplicateDocument.sender ||
                  "",

                subject:
                  duplicateDocument.subject ||
                  "",

                createdAt:
                  duplicateDocument.created_at ||
                  null,
              },
            },
            { status: 409 }
          );
        }
      }
    }

    /*
     * --------------------------------------------------
     * DOCUMENT
     * --------------------------------------------------
     */

    const {
      data: document,
      error: documentError,
    } =
      await supabase
        .from("documents")
        .insert({
          user_id:
            userId,

          document_type:
            documentType ||
            null,

          sender:
            sender ||
            null,

          subject:
            subject ||
            null,

          summary:
            summary ||
            null,

          explanation:
            explanation ||
            null,

          consequences:
            consequences ||
            null,

          importance:
            importance ||
            null,

          reply_needed:
            Boolean(
              replyNeeded
            ),

          appointment_needed:
            Boolean(
              appointmentNeeded
            ),

          official_url:
            officialUrl ||
            null,

          confidence:
            confidence ||
            null,
        })
        .select()
        .single();

    if (
      documentError
    ) {
      console.error(
        "Document save error:",
        documentError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not save document",
          details:
            documentError.message,
        },
        { status: 500 }
      );
    }

    /*
     * --------------------------------------------------
     * DEADLINES
     * --------------------------------------------------
     */

    if (
      Array.isArray(
        deadlines
      ) &&
      deadlines.length > 0
    ) {
      const deadlineRows =
        deadlines
          .filter(
            (
              deadline: any
            ) =>
              deadline?.date ||
              deadline?.description
          )
          .map(
            (
              deadline: any
            ) => {
              const hasExactDate =
                Boolean(
                  deadline?.date
                );

              return {
                document_id:
                  document.id,

                user_id:
                  userId,

                deadline_date:
                  hasExactDate
                    ? deadline.date
                    : null,

                description:
                  deadline.description ||
                  deadline.title ||
                  "Important deadline",

                importance:
                  deadline.importance ||
                  "normal",

                deadline_type:
                  hasExactDate
                    ? "exact"
                    : "relative",

                relative_description:
                  hasExactDate
                    ? null
                    : (
                        deadline.description ||
                        deadline.title ||
                        null
                      ),

                received_date:
                  null,

                calculated_deadline_date:
                  null,

                completed:
                  false,
              };
            }
          );

      if (
        deadlineRows.length > 0
      ) {
        const {
          error:
            deadlineError,
        } =
          await supabase
            .from("deadlines")
            .insert(
              deadlineRows
            );

        if (
          deadlineError
        ) {
          console.error(
            "Deadline save error:",
            deadlineError
          );
        }
      }
    }

    /*
     * --------------------------------------------------
     * PAYMENTS
     * --------------------------------------------------
     */

    if (
      Array.isArray(
        payments
      ) &&
      payments.length > 0
    ) {
      const paymentRows =
        payments
          .filter(
            (
              payment: any
            ) =>
              payment?.amount !==
                undefined ||
              payment?.dueDate ||
              payment?.recipient
          )
          .map(
            (
              payment: any
            ) => ({
              document_id:
                document.id,

              user_id:
                userId,

              amount:
                payment.amount ??
                null,

              currency:
                payment.currency ||
                "EUR",

              due_date:
                payment.dueDate ||
                null,

              recipient:
                payment.recipient ||
                null,

              payment_reference:
                payment.paymentReference ||
                null,

              completed:
                false,
            })
          );

      if (
        paymentRows.length > 0
      ) {
        const {
          error:
            paymentError,
        } =
          await supabase
            .from("payments")
            .insert(
              paymentRows
            );

        if (
          paymentError
        ) {
          console.error(
            "Payment save error:",
            paymentError
          );
        }
      }
    }

    /*
     * --------------------------------------------------
     * APPOINTMENTS
     * --------------------------------------------------
     */

    if (
      Array.isArray(
        appointments
      ) &&
      appointments.length > 0
    ) {
      const appointmentRows =
        appointments
          .filter(
            (
              appointment: any
            ) =>
              appointment?.organization ||
              appointment?.appointmentDate ||
              appointment?.description
          )
          .map(
            (
              appointment: any
            ) => ({
              document_id:
                document.id,

              user_id:
                userId,

              organization:
                appointment.organization ||
                null,

              appointment_date:
                appointment.appointmentDate ||
                null,

              description:
                appointment.description ||
                null,

              official_url:
                appointment.officialUrl ||
                null,

              completed:
                false,
            })
          );

      if (
        appointmentRows.length > 0
      ) {
        const {
          error:
            appointmentError,
        } =
          await supabase
            .from("appointments")
            .insert(
              appointmentRows
            );

        if (
          appointmentError
        ) {
          console.error(
            "Appointment save error:",
            appointmentError
          );
        }
      }
    }

    return NextResponse.json({
      success: true,

      documentId:
        document.id,

      message:
        "Scan saved successfully",
    });

  } catch (error) {
    console.error(
      "Save scan error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while saving the scan.",
      },
      { status: 500 }
    );
  }
}