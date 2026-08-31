"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, MapPin, ShieldCheck, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import Countdown from "@/components/Countdown";
import SeatMap from "@/components/SeatMap";
import { API_URL, apiFetch } from "@/lib/api";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [seatInfo, setSeatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [ticketResponse, seatsResponse] = await Promise.all([
          fetch(`${API_URL}/tickets/${id}`),
          fetch(`${API_URL}/tickets/${id}/seats`),
        ]);

        if (!ticketResponse.ok) throw new Error("Ticket not found");

        const ticketData = await ticketResponse.json();
        const seatsData = seatsResponse.ok ? await seatsResponse.json() : null;

        if (active) {
          setTicket(ticketData);
          setSeatInfo(seatsData);
        }
      } catch {
        router.replace("/not-found");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id, router]);

  const unavailable = useMemo(() => {
    if (!ticket) return true;
    if (new Date(ticket.departureAt) <= new Date()) return true;
    if (seatInfo) return seatInfo.availableCount < 1;
    return ticket.quantity < 1;
  }, [ticket, seatInfo]);

  const selectedDetails = useMemo(() => {
    if (!seatInfo) return [];
    const map = new Map(seatInfo.units.map((unit) => [unit.id, unit]));
    return selected.map((id) => map.get(id)).filter(Boolean);
  }, [seatInfo, selected]);

  const passengerCapacity = selectedDetails.reduce(
    (sum, unit) => sum + Number(unit.capacity || 1),
    0,
  );

  async function refreshSeats() {
    const response = await fetch(`${API_URL}/tickets/${id}/seats`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to refresh seat availability");
    const data = await response.json();
    setSeatInfo(data);
    return data;
  }

  async function openBooking() {
    try {
      await refreshSeats();
      setSelected([]);
      setOpen(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function book() {
    if (!selected.length) {
      return toast.error("Please select at least one seat or cabin");
    }

    setBooking(true);

    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          ticketId: ticket._id,
          selectedUnits: selected,
        }),
      });

      toast.success(`Reserved: ${selected.join(", ")}`);
      setOpen(false);
      router.push("/dashboard/bookings");
    } catch (error) {
      toast.error(error.message);

      // Another user may have reserved a seat while this modal was open.
      try {
        await refreshSeats();
        setSelected([]);
      } catch {
        // Keep the original booking error visible.
      }
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!ticket) return null;

  const transportLabel = ticket.transportType === "Launch" ? "Cruise / Launch" : ticket.transportType;
  const unitLabel = ticket.transportType === "Launch" ? "units" : "seats";
  const liveAvailable = seatInfo?.availableCount ?? ticket.quantity;

  return (
    <section className="section">
      <div className="container">
        <button className="back-link" onClick={() => router.back()}>
          <ArrowLeft size={17} /> Back to tickets
        </button>

        <div className="details-grid">
          <div>
            <div className="details-image">
              <Image
                src={ticket.image}
                alt={ticket.title}
                fill
                priority
                sizes="(max-width:900px) 100vw, 60vw"
              />
            </div>

            <div className="detail-description surface">
              <span className="eyebrow">About this journey</span>
              <h2 className="display">Comfort from departure to arrival.</h2>
              <p className="muted">
                {ticket.description ||
                  `A verified ${ticket.transportType.toLowerCase()} journey from ${ticket.from} to ${ticket.to}, operated by ${ticket.vendorName}.`}
              </p>

              <div className="perks detail-perks">
                {ticket.perks?.map((perk) => (
                  <span key={perk}>
                    <Check size={13} /> {perk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="booking-panel surface">
            <span className="status">{transportLabel}</span>
            <h1 className="display">{ticket.title}</h1>

            <p className="detail-route">
              <MapPin /> {ticket.from} <span>→</span> {ticket.to}
            </p>

            <div className="detail-meta">
              <div>
                <CalendarDays />
                <span>
                  Departure
                  <b>
                    {new Date(ticket.departureAt).toLocaleString([], {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </b>
                </span>
              </div>

              <div>
                <Ticket />
                <span>
                  Live availability
                  <b>{liveAvailable} {unitLabel} available</b>
                </span>
              </div>
            </div>

            {seatInfo && (
              <div className="availability-mini">
                <span>Available <b>{seatInfo.availableCount}</b></span>
                <span>Reserved <b>{seatInfo.reservedCount}</b></span>
                <span>Booked <b>{seatInfo.bookedCount}</b></span>
              </div>
            )}

            <div className="departure-box">
              <small>Journey begins in</small>
              <Countdown target={ticket.departureAt} />
            </div>

            <div className="booking-price">
              <span>Price per selected unit</span>
              <b>৳{Number(ticket.price).toLocaleString("en-BD")}</b>
            </div>

            <button
              className="btn btn-primary book-button"
              disabled={unavailable}
              onClick={openBooking}
            >
              {unavailable ? "Booking unavailable" : "Choose seat / cabin"}
            </button>

            <p className="secure-note">
              <ShieldCheck /> Reserved first. Pay only after vendor acceptance.
            </p>
          </aside>
        </div>
      </div>

      {open && seatInfo && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            className="booking-modal seat-booking-modal surface"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">Live seat selection</span>
            <h2 className="display">Choose your seat / cabin</h2>
            <p className="muted">Green items are free. Orange items are reserved. Red items are already paid/booked.</p>

            <div className="seat-count-summary">
              <span>Available <b>{seatInfo.availableCount}</b></span>
              <span>Reserved <b>{seatInfo.reservedCount}</b></span>
              <span>Booked <b>{seatInfo.bookedCount}</b></span>
              <span>Selected <b>{selected.length}</b></span>
            </div>

            <SeatMap
              units={seatInfo.units}
              selected={selected}
              onChange={setSelected}
            />

            <div className="selected-seat-summary">
              <span>Selected</span>
              <b>{selected.length ? selected.join(", ") : "None"}</b>
            </div>

            {passengerCapacity > selected.length && (
              <p className="muted cabin-capacity-note">
                Selected cabins can accommodate up to {passengerCapacity} passengers.
              </p>
            )}

            <div className="modal-total">
              <span>Estimated total</span>
              <b>৳{Number(ticket.price * selected.length).toLocaleString("en-BD")}</b>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                type="button"
                disabled={booking || selected.length < 1}
                onClick={book}
              >
                {booking ? "Sending…" : `Reserve ${selected.length} item${selected.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
