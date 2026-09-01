"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BusFront,
  Plane,
  Search,
  Ship,
  Sparkles,
  TrainFront,
  Tickets,
} from "lucide-react";

import TicketCard from "./TicketCard";
import { API_URL } from "@/lib/api";

/* =====================================================
   TRANSPORT ICONS
===================================================== */

const icons = {
  Bus: BusFront,
  Plane,
  Train: TrainFront,
  Cruise: Ship,
  Launch: Ship,
};

/* =====================================================
   TRANSPORT NAVIGATION
===================================================== */

const transportLinks = [
  {
    label: "Bus",
    href: "/bus",
    icon: BusFront,
  },
  {
    label: "Plane",
    href: "/plane",
    icon: Plane,
  },
  {
    label: "Train",
    href: "/train",
    icon: TrainFront,
  },
  {
    label: "Cruise",
    href: "/cruise",
    icon: Ship,
  },
  {
    label: "All Tickets",
    href: "/tickets",
    icon: Tickets,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function TravelModePage({
  mode,
  apiType,
  image,
  title,
  intro,
  points = [],
}) {
  /* ===================================================
     STATES
  =================================================== */

  const [result, setResult] =
    useState({
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [sort, setSort] =
    useState("latest");

  const [route, setRoute] =
    useState({
      from: "",
      to: "",
    });

  const [page, setPage] =
    useState(1);

  const resultsRef = useRef(null);

  const Icon =
    icons[mode] ||
    icons[apiType] ||
    BusFront;

  /* ===================================================
     LOAD TICKETS
  =================================================== */

  useEffect(() => {
    let active = true;

    const params =
      new URLSearchParams({
        transport:
          apiType || mode,
        limit: "6",
        page: String(page),
        sort,
      });

    if (route.from) {
      params.set(
        "from",
        route.from
      );
    }

    if (route.to) {
      params.set(
        "to",
        route.to
      );
    }

    fetch(
      `${API_URL}/tickets?${params.toString()}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load tickets"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }

        setResult({
          data: Array.isArray(
            data?.data
          )
            ? data.data
            : [],

          page:
            Number(data?.page) ||
            1,

          totalPages:
            Number(
              data?.totalPages
            ) || 1,

          total:
            Number(data?.total) ||
            0,
        });
      })
      .catch((error) => {
        console.error(
          `Unable to load ${mode} tickets:`,
          error
        );

        if (!active) {
          return;
        }

        setResult({
          data: [],
          page: 1,
          totalPages: 1,
          total: 0,
        });
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    apiType,
    mode,
    page,
    route.from,
    route.to,
    sort,
  ]);

  /* ===================================================
     SEARCH
  =================================================== */

  function handleSearch(event) {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    const from = String(
      formData.get("from") ||
        ""
    ).trim();

    const to = String(
      formData.get("to") ||
        ""
    ).trim();

    setLoading(true);
    setPage(1);

    setRoute({
      from,
      to,
    });
  }

  /* ===================================================
     SORT
  =================================================== */

  function handleSort(event) {
    const value =
      event.target.value;

    setLoading(true);
    setPage(1);
    setSort(value);
  }

  /* ===================================================
     CHANGE PAGE
  =================================================== */

  function changePage(
    nextPage
  ) {
    if (
      nextPage < 1 ||
      nextPage >
        result.totalPages ||
      nextPage === result.page
    ) {
      return;
    }

    setLoading(true);
    setPage(nextPage);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        }
      );
    }, 80);
  }

  /* ===================================================
     ACTIVE TRANSPORT
  =================================================== */

  function isActiveTransport(
    label
  ) {
    if (
      mode === "Cruise" &&
      label === "Cruise"
    ) {
      return true;
    }

    return label === mode;
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <>
      {/* ===============================================
          HERO
      =============================================== */}

      <section
        className="mode-page-hero"
        style={{
          backgroundImage:
            `url("${image}")`,
        }}
      >
        <div className="mode-page-overlay" />

        <div className="container mode-page-hero-inner">
          <div>
            <span className="mode-page-chip">
              <Icon size={17} />

              {mode} journeys
            </span>

            <h1 className="display">
              {title}
            </h1>

            <p>{intro}</p>
          </div>

          <div className="mode-page-stat glass">
            <Sparkles
              size={22}
            />

            <span>
              <small>
                Live approved
                inventory
              </small>

              <b>
                {result.total}{" "}
                {mode.toLowerCase()}{" "}
                {result.total === 1
                  ? "ticket"
                  : "tickets"}
              </b>
            </span>
          </div>
        </div>
      </section>

      {/* ===============================================
          TRANSPORT NAVIGATION
      =============================================== */}

      <section className="mode-transport-nav-section">
        <div className="container">
          <div className="mode-transport-nav">
            {transportLinks.map(
              ({
                label,
                href,
                icon: NavIcon,
              }) => {
                const active =
                  isActiveTransport(
                    label
                  );

                return (
                  <Link
                    key={label}
                    href={href}
                    className={`mode-transport-link ${
                      active
                        ? "active"
                        : ""
                    }`}
                  >
                    <NavIcon
                      size={17}
                    />

                    <span>
                      {label}
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ===============================================
          SEARCH AREA
      =============================================== */}

      <section className="mode-search-band">
        <div className="container">
          <form
            className="mode-search-form surface"
            onSubmit={
              handleSearch
            }
          >
            {/* FROM */}

            <label>
              <span>From</span>

              <input
                name="from"
                placeholder="Dhaka"
                defaultValue={
                  route.from
                }
                autoComplete="off"
              />
            </label>

            {/* TO */}

            <label>
              <span>To</span>

              <input
                name="to"
                placeholder="Destination"
                defaultValue={
                  route.to
                }
                autoComplete="off"
              />
            </label>

            {/* SEARCH */}

            <button
              className="btn btn-primary"
              type="submit"
            >
              <Search
                size={17}
              />

              Find {mode}
            </button>
          </form>

          {/* ===========================================
              FEATURE POINTS
          =========================================== */}

          {points.length >
            0 && (
            <div className="mode-point-grid">
              {points.map(
                (
                  point,
                  index
                ) => (
                  <div
                    key={`${point}-${index}`}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p>
                      {point}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===============================================
          TICKET RESULTS
      =============================================== */}

      <section
        className="section mode-ticket-results"
        ref={resultsRef}
      >
        <div className="container">
          {/* ===========================================
              HEADER
          =========================================== */}

          <div className="mode-results-head">
            <div>
              <span className="eyebrow">
                Approved
                departures
              </span>

              <h2 className="title">
                Available {mode}{" "}
                tickets
              </h2>

              <p className="muted">
                Only
                admin-approved{" "}
                {mode.toLowerCase()}{" "}
                listings are shown
                here.
              </p>
            </div>

            <div className="mode-results-actions">
              {/* TOTAL */}

              <div className="mode-total-count">
                <strong>
                  {result.total}
                </strong>

                <span>
                  total tickets
                </span>
              </div>

              {/* SORT */}

              <label className="mode-sort">
                <span>
                  Sort
                </span>

                <select
                  value={sort}
                  onChange={
                    handleSort
                  }
                >
                  <option value="latest">
                    Newest first
                  </option>

                  <option value="price-asc">
                    Price: low to
                    high
                  </option>

                  <option value="price-desc">
                    Price: high to
                    low
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* ===========================================
              LOADING
          =========================================== */}

          {loading ? (
            <div className="grid-cards">
              {[
                1,
                2,
                3,
                4,
                5,
                6,
              ].map(
                (item) => (
                  <div
                    className="skeleton-card"
                    key={item}
                  />
                )
              )}
            </div>
          ) : result.data.length >
            0 ? (
            <>
              {/* =======================================
                  TICKET CARDS
              ======================================= */}

              <div className="grid-cards">
                {result.data.map(
                  (ticket) => (
                    <TicketCard
                      key={
                        ticket._id
                      }
                      ticket={
                        ticket
                      }
                    />
                  )
                )}
              </div>

              {/* =======================================
                  PAGINATION
              ======================================= */}

              <div className="mode-pagination">
                {/* PREVIOUS */}

                <button
                  type="button"
                  className="mode-page-button"
                  disabled={
                    result.page <= 1 ||
                    loading
                  }
                  onClick={() =>
                    changePage(
                      result.page -
                        1
                    )
                  }
                >
                  <ArrowLeft
                    size={17}
                  />

                  Previous
                </button>

                {/* PAGE INFO */}

                <div className="mode-page-info">
                  <span>
                    Page
                  </span>

                  <strong>
                    {result.page}
                  </strong>

                  <span>
                    of
                  </span>

                  <strong>
                    {
                      result.totalPages
                    }
                  </strong>
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  className="mode-page-button mode-next-button"
                  disabled={
                    result.page >=
                      result.totalPages ||
                    loading
                  }
                  onClick={() =>
                    changePage(
                      result.page +
                        1
                    )
                  }
                >
                  Next

                  <ArrowRight
                    size={17}
                  />
                </button>
              </div>

              {/* =======================================
                  OTHER TRANSPORTS
              ======================================= */}

              <div className="mode-more-transports">
                <div>
                  <span className="eyebrow">
                    Explore more
                  </span>

                  <h3>
                    Browse another
                    transport
                  </h3>
                </div>

                <div className="mode-more-transport-links">
                  {transportLinks
                    .filter(
                      ({
                        label,
                      }) =>
                        !isActiveTransport(
                          label
                        )
                    )
                    .map(
                      ({
                        label,
                        href,
                        icon:
                          MoreIcon,
                      }) => (
                        <Link
                          href={href}
                          key={label}
                        >
                          <MoreIcon
                            size={
                              16
                            }
                          />

                          {label}

                          <ArrowRight
                            size={
                              14
                            }
                          />
                        </Link>
                      )
                    )}
                </div>
              </div>
            </>
          ) : (
            /* ===========================================
               EMPTY STATE
            =========================================== */

            <div className="empty">
              <Icon size={34} />

              <h3>
                No matching{" "}
                {mode.toLowerCase()}{" "}
                tickets
              </h3>

              <p className="muted">
                Try another route
                or browse all
                approved tickets.
              </p>

              <Link
                className="btn btn-secondary"
                href="/tickets"
              >
                All tickets

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}