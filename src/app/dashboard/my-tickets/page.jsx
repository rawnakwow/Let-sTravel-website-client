"use client";

import SafeTicketImage from "@/components/SafeTicketImage";
import { useEffect, useState } from "react";
import { Edit3, MapPin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    let active = true;

    apiFetch("/tickets/vendor/mine")
      .then((data) => {
        if (active) {
          setTickets(data);
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Refresh tickets after update/delete
  async function refreshTickets() {
    try {
      const data = await apiFetch("/tickets/vendor/mine");
      setTickets(data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function remove(ticket) {
    const confirmed = window.confirm(
      `Delete ${ticket.title}?`
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/tickets/${ticket._id}`, {
        method: "DELETE",
      });

      toast.success("Ticket deleted");

      await refreshTickets();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function update(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form);

    const payload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
    };

    try {
      await apiFetch(`/tickets/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success("Ticket updated");

      setEditing(null);

      await refreshTickets();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">
            Vendor inventory
          </span>

          <h1 className="display">
            My added tickets
          </h1>

          <p className="muted">
            Review approval status and maintain active listings.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : tickets.length ? (
        <div className="grid-cards">
          {tickets.map((ticket) => {
            const disabled =
              ticket.verificationStatus === "rejected";

            return (
              <article
                className="vendor-ticket surface"
                key={ticket._id}
              >
                <div>
                 <div className="vendor-ticket-image">
  <SafeTicketImage
    src={ticket.image}
    alt={ticket.title}
    transportType={ticket.transportType}
    className="vendor-ticket-img"
  />
</div>

                  <span className="status">
                    {ticket.verificationStatus}
                  </span>
                </div>

                <section>
                  <h3>{ticket.title}</h3>

                  <p>
                    <MapPin size={14} />
                    {ticket.from} → {ticket.to}
                  </p>

                  <div className="booking-numbers">
                    <span>
                      Price

                      <b>
                        ৳
                        {Number(
                          ticket.price || 0
                        ).toLocaleString("en-BD")}
                      </b>
                    </span>

                    <span>
                      Seats
                      <b>{ticket.quantity}</b>
                    </span>
                  </div>

                  <div className="vendor-actions">
                    <button
                      disabled={disabled}
                      className="btn btn-secondary"
                      onClick={() =>
                        setEditing(ticket)
                      }
                    >
                      <Edit3 size={16} />
                      Update
                    </button>

                    <button
                      disabled={disabled}
                      className="btn btn-danger"
                      onClick={() =>
                        remove(ticket)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </section>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <h3>No tickets added</h3>

          <p className="muted">
            Use “Add ticket” to create your first departure.
          </p>
        </div>
      )}

      {editing && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setEditing(null)}
        >
          <form
            className="booking-modal surface"
            onSubmit={update}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <span className="eyebrow">
              Edit listing
            </span>

            <h2 className="display">
              Update ticket
            </h2>

            <div className="form-grid">
              <label className="field form-wide">
                <span>Title</span>

                <input
                  className="input"
                  name="title"
                  defaultValue={editing.title}
                  required
                />
              </label>

              <label className="field">
                <span>Price (৳)</span>

                <input
                  className="input"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={editing.price}
                  required
                />
              </label>

              <label className="field">
                <span>Quantity</span>

                <input
                  className="input"
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue={editing.quantity}
                  required
                />
              </label>

              <label className="field form-wide">
                <span>Departure</span>

                <input
                  className="input"
                  name="departureAt"
                  type="datetime-local"
                  defaultValue={new Date(
                    editing.departureAt
                  )
                    .toISOString()
                    .slice(0, 16)}
                  required
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}