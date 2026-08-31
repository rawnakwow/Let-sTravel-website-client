"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CalendarDays,
  MapPin,
  Plane,
  Ship,
  TrainFront,
} from "lucide-react";

const icons = {
  Bus,
  Train: TrainFront,
  Launch: Ship,
  Plane,
};

const fallbackImages = {
  Bus:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85",

  Plane:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",

  Train:
    "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",

  Launch:
    "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=85",
};

export default function TicketCard({ ticket }) {
  const Icon =
    icons[ticket.transportType] || Bus;

  const transportLabel =
    ticket.transportType === "Launch"
      ? "Cruise"
      : ticket.transportType;

  const fallbackImage =
    fallbackImages[ticket.transportType] ||
    fallbackImages.Bus;

  const ticketImage =
    ticket.image ||
    ticket.imageUrl ||
    fallbackImage;

  return (
    <article className="ticket-card surface">
      <div className="ticket-image">
        <img
          src={ticketImage}
          alt={ticket.title || "Travel ticket"}
          className="ticket-card-img"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              fallbackImage;
          }}
        />

        <span className="transport">
          <Icon size={14} />
          {transportLabel}
        </span>
      </div>

      <div className="ticket-body">
        <div className="ticket-title-row">
          <div>
            <p className="route">
              <MapPin size={14} />

              {ticket.from}

              <span>→</span>

              {ticket.to}
            </p>

            <h3>{ticket.title}</h3>
          </div>

          <strong>
            ৳
            {Number(
              ticket.price || 0
            ).toLocaleString("en-BD")}

            <small>/seat</small>
          </strong>
        </div>

        {ticket.departureAt && (
          <p className="ticket-date">
            <CalendarDays size={15} />

            {new Date(
              ticket.departureAt
            ).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}

        <div className="perks">
          {ticket.perks
            ?.slice(0, 3)
            .map((perk) => (
              <span key={perk}>
                {perk}
              </span>
            ))}
        </div>

        <div className="ticket-bottom">
          <span>
            <b>{ticket.quantity}</b>{" "}
            seats left
          </span>

          <Link
            href={`/tickets/${ticket._id}`}
          >
            See details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}