"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, uploadImage } from "@/lib/api";

const perks = [
  "AC",
  "Wi-Fi",
  "Breakfast",
  "Water",
  "Charging port",
  "Sleeper seat",
];

const defaults = {
  // Bus
  busType: "HD",
  busLayout: "2x2",
  busRows: 10,

  // Plane
  planeLayout: "3x3",
  planeRows: 10,
  planeBusinessRows: 0,
  planeExitRows: "5",

  // Train
  trainLayout: "2x2",
  trainCoaches: 3,
  trainRowsPerCoach: 8,
  trainClass: "Snigdha",

  // Launch / Cruise
  launchSingleCabins: 4,
  launchDoubleCabins: 4,
  launchFamilyCabins: 2,
  launchChairSeats: 20,
  launchDeckSeats: 20,
};

function number(value) {
  return Math.max(0, Number(value) || 0);
}

function estimatedUnits(transportType, layout) {
  if (transportType === "Bus") {
    const perRow =
      layout.busLayout === "2x2"
        ? 4
        : layout.busLayout === "2x1"
          ? 3
          : 2;

    const decks = layout.busType === "DD" ? 2 : 1;

    return number(layout.busRows) * perRow * decks;
  }

  if (transportType === "Plane") {
    const rows = number(layout.planeRows);

    const businessRows = Math.min(
      rows,
      number(layout.planeBusinessRows)
    );

    const economyRows = Math.max(
      0,
      rows - businessRows
    );

    const economyPerRow =
      layout.planeLayout === "3x3" ? 6 : 4;

    // Business = 2 + 2 = 4 seats
    return (
      businessRows * 4 +
      economyRows * economyPerRow
    );
  }

  if (transportType === "Train") {
    const perRow =
      layout.trainLayout === "2x2"
        ? 4
        : layout.trainLayout === "2x1"
          ? 3
          : 4;

    return (
      number(layout.trainCoaches) *
      number(layout.trainRowsPerCoach) *
      perRow
    );
  }

  // Cruise / Launch
  return (
    number(layout.launchSingleCabins) +
    number(layout.launchDoubleCabins) +
    number(layout.launchFamilyCabins) +
    number(layout.launchChairSeats) +
    number(layout.launchDeckSeats)
  );
}

export default function AddTicketPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [transportType, setTransportType] =
    useState("Bus");

  const [layout, setLayout] =
    useState(defaults);

  const [imageUrl, setImageUrl] =
    useState("");

  const [filePreview, setFilePreview] =
    useState("");

  const [imageError, setImageError] =
    useState(false);

  // =========================
  // LOAD VENDOR PROFILE
  // =========================

  useEffect(() => {
    let active = true;

    apiFetch("/users/me")
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch(() => {
        if (active) {
          setProfile({});
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // =========================
  // CLEAN LOCAL IMAGE PREVIEW
  // =========================

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // =========================
  // GENERATED QUANTITY
  // =========================

  const quantity = useMemo(
    () =>
      estimatedUnits(
        transportType,
        layout
      ),
    [transportType, layout]
  );

  function updateLayout(name, value) {
    setLayout((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // =========================
  // IMAGE FILE PREVIEW
  // =========================

  function handleFileChange(event) {
    const file =
      event.target.files?.[0];

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    if (!file) {
      setFilePreview("");
      return;
    }

    setFilePreview(
      URL.createObjectURL(file)
    );

    setImageError(false);
  }

  // =========================
  // CURRENT LAYOUT CONFIG
  // =========================

  function currentLayoutConfig() {
    if (transportType === "Bus") {
      return {
        busType: layout.busType,
        busLayout: layout.busLayout,
        busRows: Number(
          layout.busRows
        ),
      };
    }

    if (transportType === "Plane") {
      return {
        planeLayout:
          layout.planeLayout,

        planeRows: Number(
          layout.planeRows
        ),

        planeBusinessRows:
          Number(
            layout.planeBusinessRows
          ),

        planeExitRows:
          layout.planeExitRows,
      };
    }

    if (transportType === "Train") {
      return {
        trainLayout:
          layout.trainLayout,

        trainCoaches: Number(
          layout.trainCoaches
        ),

        trainRowsPerCoach:
          Number(
            layout.trainRowsPerCoach
          ),

        trainClass:
          layout.trainClass,
      };
    }

    return {
      launchSingleCabins:
        Number(
          layout.launchSingleCabins
        ),

      launchDoubleCabins:
        Number(
          layout.launchDoubleCabins
        ),

      launchFamilyCabins:
        Number(
          layout.launchFamilyCabins
        ),

      launchChairSeats:
        Number(
          layout.launchChairSeats
        ),

      launchDeckSeats:
        Number(
          layout.launchDeckSeats
        ),
    };
  }

  // =========================
  // SUBMIT TICKET
  // =========================

  async function submit(event) {
    event.preventDefault();

    if (quantity < 1) {
      toast.error(
        "The layout must contain at least one seat or cabin"
      );

      return;
    }

    setSubmitting(true);

    const form = new FormData(
      event.currentTarget
    );

    try {
      const file =
        form.get("imageFile");

      const image = file?.size
        ? await uploadImage(file)
        : imageUrl.trim();

      if (!image) {
        throw new Error(
          "Please upload an image or provide an image URL"
        );
      }

      const payload = {
        title: form.get("title"),

        from: form.get("from"),

        to: form.get("to"),

        transportType,

        price: Number(
          form.get("price")
        ),

        quantity,

        departureAt:
          form.get("departureAt"),

        description:
          form.get("description"),

        perks:
          form.getAll("perks"),

        image,

        layoutConfig:
          currentLayoutConfig(),
      };

      await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      });

      toast.success(
        "Ticket and seat plan submitted for admin review"
      );

      router.push(
        "/dashboard/my-tickets"
      );
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setSubmitting(false);
    }
  }

  const previewImage =
    filePreview ||
    imageUrl.trim();

  return (
    <>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="dash-head">
        <div>
          <span className="eyebrow">
            Vendor inventory
          </span>

          <h1 className="display">
            Add a new ticket
          </h1>

          <p className="muted">
            Choose a real transport layout.
            Let&apos;sTravel will generate
            the seats, coaches or cabins
            automatically.
          </p>
        </div>
      </div>

      <form
        className="ticket-form surface"
        onSubmit={submit}
      >
        {/* =========================
            JOURNEY DETAILS
        ========================= */}

        <div className="form-section">
          <h3>Journey details</h3>

          <div className="form-grid">
            <label className="field form-wide">
              <span>
                Ticket title
              </span>

              <input
                className="input"
                name="title"
                required
                placeholder="Green Line Dhaka–Cox's Bazar"
              />
            </label>

            <label className="field">
              <span>From</span>

              <input
                className="input"
                name="from"
                required
                placeholder="Dhaka"
              />
            </label>

            <label className="field">
              <span>To</span>

              <input
                className="input"
                name="to"
                required
                placeholder="Cox's Bazar"
              />
            </label>

            <label className="field">
              <span>
                Transport type
              </span>

              <select
                className="input"
                name="transportType"
                value={
                  transportType
                }
                onChange={(event) =>
                  setTransportType(
                    event.target.value
                  )
                }
              >
                <option value="Bus">
                  Bus
                </option>

                <option value="Plane">
                  Plane
                </option>

                <option value="Train">
                  Train
                </option>

                <option value="Launch">
                  Cruise / Launch
                </option>
              </select>
            </label>

            <label className="field">
              <span>
                Departure date & time
              </span>

              <input
                className="input"
                type="datetime-local"
                name="departureAt"
                required
              />
            </label>

            <label className="field">
              <span>
                Price per selected unit
                (৳)
              </span>

              <input
                className="input"
                type="number"
                min="1"
                step="1"
                name="price"
                required
                placeholder="1200"
              />
            </label>

            <label className="field">
              <span>
                Generated ticket quantity
              </span>

              <input
                className="input"
                readOnly
                value={quantity}
              />
            </label>

            <label className="field form-wide">
              <span>
                Description
              </span>

              <textarea
                className="input"
                rows="4"
                name="description"
                placeholder="Describe the operator and travel experience."
              />
            </label>
          </div>
        </div>

        {/* =========================
            SEAT / CABIN PLAN
        ========================= */}

        <div className="form-section">
          <h3>
            Seat / cabin plan
          </h3>

          <p className="muted layout-help">
            The selected template is
            saved with the ticket and
            becomes the live booking map
            for users.
          </p>

          {/* =================
              BUS
          ================= */}

          {transportType ===
            "Bus" && (
            <div className="form-grid">
              <label className="field">
                <span>
                  Bus body type
                </span>

                <select
                  className="input"
                  value={
                    layout.busType
                  }
                  onChange={(event) =>
                    updateLayout(
                      "busType",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="HD">
                    High Deck (HD)
                  </option>

                  <option value="LD">
                    Low Deck (LD)
                  </option>

                  <option value="DD">
                    Double Decker (DD)
                  </option>
                </select>
              </label>

              <label className="field">
                <span>
                  Seat layout
                </span>

                <select
                  className="input"
                  value={
                    layout.busLayout
                  }
                  onChange={(event) =>
                    updateLayout(
                      "busLayout",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="2x2">
                    2 + 2
                  </option>

                  <option value="2x1">
                    2 + 1 Business
                  </option>

                  <option value="sleeper">
                    Sleeper
                  </option>
                </select>
              </label>

              <label className="field">
                <span>
                  {layout.busType ===
                  "DD"
                    ? "Rows per deck"
                    : "Rows"}
                </span>

                <input
                  className="input"
                  type="number"
                  min="1"
                  max="25"
                  value={
                    layout.busRows
                  }
                  onChange={(event) =>
                    updateLayout(
                      "busRows",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <div className="layout-summary">
                <span>
                  Generated
                </span>

                <b>
                  {quantity} seats
                </b>

                <small>
                  {layout.busType ===
                  "DD"
                    ? "Upper + Lower deck"
                    : layout.busType ===
                        "HD"
                      ? "High deck"
                      : "Low deck"}
                </small>
              </div>
            </div>
          )}

          {/* =================
              PLANE
          ================= */}

          {transportType ===
            "Plane" && (
            <div className="form-grid">
              <label className="field">
                <span>
                  Economy layout
                </span>

                <select
                  className="input"
                  value={
                    layout.planeLayout
                  }
                  onChange={(event) =>
                    updateLayout(
                      "planeLayout",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="3x3">
                    3 + 3
                  </option>

                  <option value="2x2">
                    2 + 2
                  </option>
                </select>
              </label>

              <label className="field">
                <span>
                  Total rows
                </span>

                <input
                  className="input"
                  type="number"
                  min="1"
                  max="40"
                  value={
                    layout.planeRows
                  }
                  onChange={(event) =>
                    updateLayout(
                      "planeRows",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Business rows
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  max="8"
                  value={
                    layout.planeBusinessRows
                  }
                  onChange={(event) =>
                    updateLayout(
                      "planeBusinessRows",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Exit row numbers
                </span>

                <input
                  className="input"
                  value={
                    layout.planeExitRows
                  }
                  onChange={(event) =>
                    updateLayout(
                      "planeExitRows",
                      event.target
                        .value
                    )
                  }
                  placeholder="5, 10"
                />
              </label>

              <div className="layout-summary form-wide">
                <span>
                  Generated
                </span>

                <b>
                  {quantity} aircraft
                  seats
                </b>

                <small>
                  Exit rows will be
                  marked automatically.
                </small>
              </div>
            </div>
          )}

          {/* =================
              TRAIN
          ================= */}

          {transportType ===
            "Train" && (
            <div className="form-grid">
              <label className="field">
                <span>
                  Coach layout
                </span>

                <select
                  className="input"
                  value={
                    layout.trainLayout
                  }
                  onChange={(event) =>
                    updateLayout(
                      "trainLayout",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="2x2">
                    2 + 2 Seat
                  </option>

                  <option value="2x1">
                    2 + 1 Seat
                  </option>

                  <option value="berth">
                    Berth / Sleeper
                  </option>
                </select>
              </label>

              <label className="field">
                <span>Class</span>

                <select
                  className="input"
                  value={
                    layout.trainClass
                  }
                  onChange={(event) =>
                    updateLayout(
                      "trainClass",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="Shovon Chair">
                    Shovon Chair
                  </option>

                  <option value="Snigdha">
                    Snigdha
                  </option>

                  <option value="AC Seat">
                    AC Seat
                  </option>

                  <option value="AC Berth">
                    AC Berth
                  </option>
                </select>
              </label>

              <label className="field">
                <span>
                  Number of coaches
                </span>

                <input
                  className="input"
                  type="number"
                  min="1"
                  max="10"
                  value={
                    layout.trainCoaches
                  }
                  onChange={(event) =>
                    updateLayout(
                      "trainCoaches",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Rows / compartments
                  per coach
                </span>

                <input
                  className="input"
                  type="number"
                  min="1"
                  max="30"
                  value={
                    layout.trainRowsPerCoach
                  }
                  onChange={(event) =>
                    updateLayout(
                      "trainRowsPerCoach",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <div className="layout-summary form-wide">
                <span>
                  Generated
                </span>

                <b>
                  {quantity} train seats
                  / berths
                </b>

                <small>
                  Coach IDs are
                  generated as A, B,
                  C…
                </small>
              </div>
            </div>
          )}

          {/* =================
              CRUISE / LAUNCH
          ================= */}

          {transportType ===
            "Launch" && (
            <div className="form-grid">
              <label className="field">
                <span>
                  Single cabins
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  value={
                    layout.launchSingleCabins
                  }
                  onChange={(event) =>
                    updateLayout(
                      "launchSingleCabins",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Double cabins
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  value={
                    layout.launchDoubleCabins
                  }
                  onChange={(event) =>
                    updateLayout(
                      "launchDoubleCabins",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Family cabins
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  value={
                    layout.launchFamilyCabins
                  }
                  onChange={(event) =>
                    updateLayout(
                      "launchFamilyCabins",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Chair seats
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  value={
                    layout.launchChairSeats
                  }
                  onChange={(event) =>
                    updateLayout(
                      "launchChairSeats",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="field">
                <span>
                  Deck seats
                </span>

                <input
                  className="input"
                  type="number"
                  min="0"
                  value={
                    layout.launchDeckSeats
                  }
                  onChange={(event) =>
                    updateLayout(
                      "launchDeckSeats",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <div className="layout-summary">
                <span>
                  Generated
                </span>

                <b>
                  {quantity} bookable
                  units
                </b>

                <small>
                  Cabins + chair seats +
                  deck seats
                </small>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            COMFORT / PERKS / IMAGE
        ========================= */}

        <div className="form-section">
          <h3>
            Comfort & imagery
          </h3>

          <div className="perk-options">
            {perks.map((perk) => (
              <label key={perk}>
                <input
                  type="checkbox"
                  name="perks"
                  value={perk}
                />{" "}
                {perk}
              </label>
            ))}
          </div>

          <div className="image-input-layout">
            <div className="image-input-fields">
              <label className="field">
                <span>
                  Upload image (ImgBB)
                </span>

                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  name="imageFile"
                  onChange={
                    handleFileChange
                  }
                />
              </label>

              <label className="field">
                <span>
                  Or image URL
                </span>

                <input
                  className="input"
                  type="url"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(event) => {
                    setImageUrl(
                      event.target.value
                    );

                    setImageError(
                      false
                    );
                  }}
                  placeholder="https://example.com/bus.jpg"
                />
              </label>
            </div>

            {/* =========================
                IMAGE PREVIEW
            ========================= */}

            <aside className="ticket-image-preview">
              <div className="preview-heading">
                <span>
                  Image preview
                </span>

                {previewImage &&
                  !imageError && (
                    <span className="preview-live">
                      Live
                    </span>
                  )}
              </div>

              <div className="preview-image-box">
                {previewImage &&
                !imageError ? (
                  <img
                    src={previewImage}
                    alt="Ticket preview"
                    onError={() =>
                      setImageError(
                        true
                      )
                    }
                  />
                ) : (
                  <div className="preview-placeholder">
                    <ImageIcon
                      size={30}
                    />

                    <span>
                      {imageError
                        ? "Could not load this image"
                        : "Transport image will appear here"}
                    </span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* =========================
            VENDOR
        ========================= */}

        <div className="form-section">
          <h3>Vendor</h3>

          <div className="form-grid">
            <label className="field">
              <span>
                Vendor name
              </span>

              <input
                className="input"
                readOnly
                value={
                  profile.name || ""
                }
              />
            </label>

            <label className="field">
              <span>
                Vendor email
              </span>

              <input
                className="input"
                readOnly
                value={
                  profile.email || ""
                }
              />
            </label>
          </div>
        </div>

        {/* =========================
            SUBMIT
        ========================= */}

        <button
          disabled={submitting}
          className="btn btn-primary"
          type="submit"
        >
          {submitting
            ? "Submitting…"
            : "Add ticket"}
        </button>
      </form>
    </>
  );
}