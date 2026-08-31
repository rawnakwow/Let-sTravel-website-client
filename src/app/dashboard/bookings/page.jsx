"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CreditCard, MapPin, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Countdown from "@/components/Countdown";
import { apiFetch } from "@/lib/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    let active = true;

    apiFetch("/bookings/mine")
      .then((data) => {
        if (active) setBookings(data);
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
    const data = await apiFetch("/bookings/mine");
    setBookings(data);
  }

  async function pay(booking) {
    setPaying(booking._id);

    try {
      const result = await apiFetch("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking._id }),
      });

      window.location.assign(result.url);
    } catch (error) {
      toast.error(error.message);
      setPaying(null);
    }
  }

  async function cancelBooking(booking) {
    if (!window.confirm(`Cancel your booking for ${booking.ticketTitle}?`)) return;

    setCancelling(booking._id);

    try {
      await apiFetch(`/bookings/${booking._id}/cancel`, {
        method: "PATCH",
      });

      toast.success("Booking cancelled. Your selected seats are available again.");
      await refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancelling(null);
    }
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Your journeys</span>
          <h1 className="display">My booked tickets</h1>
          <p className="muted">Track selected seats, booking status, countdowns and payments.</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : bookings.length ? (
        <div className="grid-cards">
          {bookings.map((booking) => {
            const expired = new Date(booking.departureAt) <= new Date();
            const selection = booking.selectedUnits || booking.seats || [];

            return (
              <article className="booking-card surface" key={booking._id}>
                <div className="booking-thumb">
                  <Image src={booking.image} alt={booking.ticketTitle || "Ticket"} fill sizes="33vw" />
                  <span className="status">{booking.status}</span>
                </div>

                <div className="booking-card-body">
                  <h3>{booking.ticketTitle}</h3>
                  <p><MapPin size={14} /> {booking.from} → {booking.to}</p>

                  {selection.length > 0 && (
                    <div className="booking-selection">
                      <span>{booking.transportType === "Launch" ? "Cabin / seat" : "Seat"}</span>
                      <b>{selection.join(", ")}</b>
                    </div>
                  )}

                  <div className="booking-numbers">
                    <span>
                      Units
                      <b>{booking.quantity}</b>
                    </span>

                    <span>
                      Total
                      <b>৳{Number(booking.totalPrice || 0).toLocaleString("en-BD")}</b>
                    </span>
                  </div>

                  {!['rejected', 'cancelled'].includes(booking.status) && (
                    <Countdown target={booking.departureAt} compact />
                  )}

                  {booking.status === "pending" && (
                    <button
                      className="btn btn-danger booking-cancel"
                      disabled={cancelling === booking._id}
                      onClick={() => cancelBooking(booking)}
                    >
                      <XCircle size={17} />
                      {cancelling === booking._id ? "Cancelling…" : "Cancel booking"}
                    </button>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      className="btn btn-primary"
                      disabled={expired || paying === booking._id}
                      onClick={() => pay(booking)}
                    >
                      <CreditCard size={17} />
                      {expired ? "Payment closed" : paying === booking._id ? "Opening…" : "Pay now"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <h3>No bookings yet</h3>
          <p className="muted">Your ticket requests will appear here instantly.</p>
        </div>
      )}
    </>
  );
}
