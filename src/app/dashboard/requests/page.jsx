"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    let active = true;

    apiFetch("/bookings/requested")
      .then((data) => {
        if (active) setRequests(data);
      })
      .catch((error) => {
        if (active) toast.error(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const data = await apiFetch("/bookings/requested");
    setRequests(data);
  }

  async function decide(id, status) {
    setProcessing(id);

    try {
      await apiFetch(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success(status === "accepted" ? "Booking accepted" : "Booking rejected");
      await refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(null);
    }
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Customer demand</span>
          <h1 className="display">Requested bookings</h1>
          <p className="muted">Review the exact seats, coaches or cabins selected by each customer.</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : requests.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Ticket</th>
                <th>Seat / Cabin</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((item) => {
                const selection = item.selectedUnits || item.seats || [];

                return (
                  <tr key={item._id}>
                    <td>
                      <b>{item.userName}</b>
                      <br />
                      <small>{item.userEmail}</small>
                    </td>

                    <td>{item.ticketTitle}</td>
                    <td><b>{selection.length ? selection.join(", ") : "Legacy booking"}</b></td>
                    <td>{item.quantity}</td>
                    <td><b>৳{Number(item.totalPrice || 0).toLocaleString("en-BD")}</b></td>
                    <td><span className="status">{item.status}</span></td>

                    <td>
                      {item.status === "pending" ? (
                        <div className="table-actions">
                          <button
                            disabled={processing === item._id}
                            onClick={() => decide(item._id, "accepted")}
                          >
                            <Check size={16} />
                            {processing === item._id ? "Processing..." : "Accept"}
                          </button>

                          <button
                            className="reject"
                            disabled={processing === item._id}
                            onClick={() => decide(item._id, "rejected")}
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="decision-complete">
                          <CheckCircle2 size={15} />
                          {item.status === "accepted" && "Accepted"}
                          {item.status === "rejected" && "Rejected"}
                          {item.status === "cancelled" && "Cancelled by user"}
                          {item.status === "paid" && "Payment completed"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <h3>No booking requests</h3>
          <p className="muted">New customer requests will appear here.</p>
        </div>
      )}
    </>
  );
}
