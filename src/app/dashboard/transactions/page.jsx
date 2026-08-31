"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CheckCircle2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

function TransactionsContent() {
  const params = useSearchParams();
  const confirmed = useRef(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const sessionId = params.get("session_id");

      try {
        if (sessionId && !confirmed.current) {
          confirmed.current = true;
          await apiFetch("/payments/confirm", {
            method: "POST",
            body: JSON.stringify({ sessionId }),
          });
          toast.success("Payment successful. Your ticket is ready.");
        }

        const data = await apiFetch("/payments/transactions");
        if (active) setTransactions(data);
      } catch (error) {
        if (active) toast.error(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [params]);

  async function printTicket(item) {
    setPrinting(item._id);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const seats = item.selectedUnits || item.seats || [];

      const formatDate = (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleString("en-BD", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      };

      const safe = (value) => String(value ?? "N/A");
      const money = Number(item.amount || 0).toLocaleString("en-BD");

      doc.setFillColor(13, 114, 94);
      doc.rect(0, 0, pageWidth, 42, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("Let'sTravel", 20, 20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Travel Ticket & Payment Receipt", 20, 29);

      doc.setTextColor(20, 40, 36);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("PAYMENT SUCCESSFUL", 20, 57);

      let y = 72;
      const row = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${label}:`, 20, y);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(safe(value), pageWidth - 90);
        doc.text(lines, 67, y);
        y += Math.max(9, lines.length * 5 + 3);
      };

      row("Ticket", item.ticketTitle);
      row("Route", `${safe(item.from)} -> ${safe(item.to)}`);
      row(item.transportType === "Launch" ? "Cabin / Seat" : "Seat", seats.length ? seats.join(", ") : "N/A");
      row("Quantity", item.quantity);
      if (item.passengerCapacity) row("Passenger capacity", item.passengerCapacity);
      row("Departure", formatDate(item.departureAt));
      row("Passenger", item.userName);
      row("Email", item.userEmail);
      row("Total paid", `BDT ${money}`);
      row("Payment date", formatDate(item.paymentDate));
      row("Transaction ID", item.transactionId);
      row("Booking ID", item.bookingId);

      y += 5;
      doc.setDrawColor(220, 225, 223);
      doc.line(20, y, pageWidth - 20, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Status: PAID", 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for travelling with Let'sTravel.", 20, y);

      const id = safe(item.transactionId || item._id || "ticket")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 35);

      doc.save(`LetsTravel-Ticket-${id}.pdf`);
      toast.success("PDF ticket downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to download ticket. Make sure jspdf is installed.");
    } finally {
      setPrinting(null);
    }
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Payment records</span>
          <h1 className="display">Transaction history</h1>
          <p className="muted">Successful payments with printable seat/cabin tickets.</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : transactions.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Ticket</th>
                <th>Seat / Cabin</th>
                <th>Amount</th>
                <th>Payment date</th>
                <th>Status</th>
                <th>Ticket</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => {
                const seats = item.selectedUnits || item.seats || [];

                return (
                  <tr key={item._id}>
                    <td><code>{item.transactionId}</code></td>
                    <td>{item.ticketTitle}</td>
                    <td><b>{seats.length ? seats.join(", ") : "—"}</b></td>
                    <td><b>৳{Number(item.amount || 0).toLocaleString("en-BD")}</b></td>
                    <td>{new Date(item.paymentDate).toLocaleString("en-BD")}</td>
                    <td><span className="status"><CheckCircle2 size={13} /> Paid</span></td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={printing === item._id}
                        onClick={() => printTicket(item)}
                      >
                        <Printer size={16} />
                        {printing === item._id ? "Preparing..." : "Print Ticket"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <h3>No transactions yet</h3>
          <p className="muted">Completed payments will be listed here.</p>
        </div>
      )}
    </>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsContent />
    </Suspense>
  );
}
