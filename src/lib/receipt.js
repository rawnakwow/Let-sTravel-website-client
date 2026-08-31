function safeValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  return String(value);
}

function formatMoney(amount) {
  return `BDT ${Number(
    amount || 0
  ).toLocaleString("en-BD")}`;
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString(
    "en-BD",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function escapeHtml(value) {
  return safeValue(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   DOWNLOAD PDF
========================= */

export async function downloadReceipt(
  transaction
) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  /*
   * Header
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);

  doc.text(
    "Let'sTravel",
    20,
    25
  );

  doc.setFontSize(10);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Travel Ticket & Payment Receipt",
    20,
    33
  );

  doc.setDrawColor(200);
  doc.line(
    20,
    40,
    pageWidth - 20,
    40
  );

  /*
   * Payment success
   */
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.text(
    "PAYMENT SUCCESSFUL",
    20,
    52
  );

  doc.setFontSize(10);
  doc.setFont(
    "helvetica",
    "normal"
  );

  let y = 65;

  function row(label, value) {
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      `${label}:`,
      20,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      safeValue(value),
      68,
      y
    );

    y += 9;
  }

  row(
    "Ticket",
    transaction.ticketTitle
  );

  row(
    "Passenger",
    transaction.userName
  );

  row(
    "Email",
    transaction.userEmail
  );

  row(
    "Route",
    `${safeValue(
      transaction.from
    )} -> ${safeValue(
      transaction.to
    )}`
  );

  row(
    "Departure",
    formatDate(
      transaction.departureAt
    )
  );

  row(
    "Quantity",
    transaction.quantity
  );

  row(
    "Unit price",
    formatMoney(
      transaction.unitPrice
    )
  );

  row(
    "Total paid",
    formatMoney(
      transaction.amount
    )
  );

  row(
    "Payment date",
    formatDate(
      transaction.paymentDate
    )
  );

  row(
    "Transaction ID",
    transaction.transactionId
  );

  row(
    "Booking ID",
    transaction.bookingId
  );

  /*
   * Footer
   */
  y += 8;

  doc.setDrawColor(200);

  doc.line(
    20,
    y,
    pageWidth - 20,
    y
  );

  y += 10;

  doc.setFontSize(9);

  doc.text(
    "Status: PAID",
    20,
    y
  );

  y += 7;

  doc.text(
    "Thank you for travelling with Let'sTravel.",
    20,
    y
  );

  y += 7;

  doc.text(
    "This receipt was generated electronically.",
    20,
    y
  );

  const id = safeValue(
    transaction.transactionId
  )
    .replace(
      /[^a-zA-Z0-9-_]/g,
      "-"
    )
    .slice(0, 40);

  doc.save(
    `LetsTravel-Receipt-${id}.pdf`
  );
}


/* =========================
   PRINT RECEIPT
========================= */

export function printReceipt(
  transaction
) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=850,height=900"
  );

  if (!printWindow) {
    throw new Error(
      "Please allow pop-ups to print the receipt."
    );
  }

  const title =
    escapeHtml(
      transaction.ticketTitle
    );

  const userName =
    escapeHtml(
      transaction.userName
    );

  const email =
    escapeHtml(
      transaction.userEmail
    );

  const from =
    escapeHtml(
      transaction.from
    );

  const to =
    escapeHtml(
      transaction.to
    );

  const transactionId =
    escapeHtml(
      transaction.transactionId
    );

  const bookingId =
    escapeHtml(
      transaction.bookingId
    );

  printWindow.document.write(`
    <!DOCTYPE html>

    <html>
      <head>
        <title>Let'sTravel Receipt</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 35px;
            font-family:
              Arial,
              sans-serif;
            color: #17322d;
            background: #ffffff;
          }

          .receipt {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            border: 1px solid #d8e1de;
            border-radius: 20px;
            overflow: hidden;
          }

          .header {
            background: #0d725e;
            color: white;
            padding: 28px;
          }

          .brand {
            margin: 0;
            font-size: 30px;
          }

          .subtitle {
            margin:
              7px 0 0;
            opacity: .85;
          }

          .success {
            padding:
              20px 28px;
            background: #edf8f4;
            color: #0d725e;
            font-weight: 700;
          }

          .body {
            padding: 28px;
          }

          .route {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
          }

          .row {
            display: flex;
            justify-content:
              space-between;
            gap: 25px;
            padding:
              11px 0;
            border-bottom:
              1px solid #edf1ef;
          }

          .label {
            color: #687b76;
          }

          .value {
            font-weight: 700;
            text-align: right;
          }

          .total {
            margin-top: 20px;
            padding: 18px;
            border-radius: 14px;
            background: #f5f7f6;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            font-size: 20px;
            font-weight: 700;
          }

          .footer {
            padding:
              0 28px 28px;
            color: #687b76;
            text-align: center;
            font-size: 12px;
          }

          @media print {
            body {
              padding: 0;
            }

            .receipt {
              border: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <h1 class="brand">
              Let'sTravel
            </h1>

            <p class="subtitle">
              Travel Ticket & Payment Receipt
            </p>
          </div>

          <div class="success">
            ✓ PAYMENT SUCCESSFUL
          </div>

          <div class="body">

            <div class="route">
              ${from} → ${to}
            </div>

            <div class="row">
              <span class="label">
                Ticket
              </span>

              <span class="value">
                ${title}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Passenger
              </span>

              <span class="value">
                ${userName}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Email
              </span>

              <span class="value">
                ${email}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Departure
              </span>

              <span class="value">
                ${escapeHtml(
                  formatDate(
                    transaction.departureAt
                  )
                )}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Tickets
              </span>

              <span class="value">
                ${escapeHtml(
                  transaction.quantity
                )}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Transaction ID
              </span>

              <span class="value">
                ${transactionId}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Booking ID
              </span>

              <span class="value">
                ${bookingId}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Payment date
              </span>

              <span class="value">
                ${escapeHtml(
                  formatDate(
                    transaction.paymentDate
                  )
                )}
              </span>
            </div>

            <div class="total">
              <span>
                Total Paid
              </span>

              <span>
                ৳${Number(
                  transaction.amount || 0
                ).toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>

          </div>

          <div class="footer">
            Thank you for travelling with
            Let'sTravel.
            <br />
            This is an electronically generated
            payment receipt.
          </div>

        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 400);
}