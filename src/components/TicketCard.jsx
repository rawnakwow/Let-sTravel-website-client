import Image from "next/image";
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

export default function TicketCard({ ticket }) {
  const Icon = icons[ticket.transportType] || Bus;

  const transportLabel =
    ticket.transportType === "Launch"
      ? "Cruise"
      : ticket.transportType;

  return (
    <article className="ticket-card surface">
      <div className="ticket-image">
        <Image
          src={ticket.image}
          alt={ticket.title}
          fill
          sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
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
            ৳{Number(ticket.price).toLocaleString("en-BD")}
            <small>/seat</small>
          </strong>
        </div>

        {ticket.departureAt && (
          <p className="ticket-date">
            <CalendarDays size={15} />

            {new Date(ticket.departureAt).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}

        <div className="perks">
          {ticket.perks?.slice(0, 3).map((perk) => (
            <span key={perk}>{perk}</span>
          ))}
        </div>

        <div className="ticket-bottom">
          <span>
            <b>{ticket.quantity}</b> seats left
          </span>

          <Link href={`/tickets/${ticket._id}`}>
            See details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}