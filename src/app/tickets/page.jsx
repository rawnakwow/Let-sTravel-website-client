"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Filter,
  Search,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";

import TicketCard from "@/components/TicketCard";
import { API_URL } from "@/lib/api";

/* =====================================================
   AVAILABLE LOCATIONS
===================================================== */

const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Cox's Bazar",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Bandarban",
  "Teknaf",
  "Kuakata",
  "Saidpur",
  "Dinajpur",
  "Panchagarh",
  "Patuakhali",
  "Bhola",
  "Chandpur",
  "Hularhat",
  "Cumilla",
  "Noakhali",
  "Feni",
  "Bogura",
  "Jashore",
  "Kushtia",
  "Natore",
  "Pabna",
  "Gazipur",
  "Narayanganj",
  "Tangail",
];

/* =====================================================
   AUTOCOMPLETE INPUT
===================================================== */

function LocationAutocomplete({
  name,
  label,
  placeholder,
  defaultValue = "",
}) {
  const [value, setValue] =
    useState(defaultValue);

  const [open, setOpen] =
    useState(false);

  const wrapperRef = useRef(null);

  /* ---------------------------------
     FILTER LOCATIONS
  --------------------------------- */

  const suggestions = useMemo(() => {
    const searchValue =
      value.trim().toLowerCase();

    if (!searchValue) {
      return LOCATIONS.slice(0, 8);
    }

    return LOCATIONS.filter((location) =>
      location
        .toLowerCase()
        .includes(searchValue)
    ).slice(0, 8);
  }, [value]);

  /* ---------------------------------
     CLOSE WHEN CLICKING OUTSIDE
  --------------------------------- */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function selectLocation(location) {
    setValue(location);
    setOpen(false);
  }

  return (
    <div
      className="listing-autocomplete"
      ref={wrapperRef}
    >
      <label>
        <span>{label}</span>

        <input
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
        />
      </label>

      {open && (
        <div className="location-suggestions">
          {suggestions.length > 0 ? (
            suggestions.map(
              (location) => (
                <button
                  key={location}
                  type="button"
                  className="location-suggestion"
                  onClick={() =>
                    selectLocation(
                      location
                    )
                  }
                >
                  <span className="location-icon">
                    <MapPin size={16} />
                  </span>

                  <span className="location-text">
                    <b>{location}</b>
                    <small>
                      Bangladesh
                    </small>
                  </span>
                </button>
              )
            )
          ) : (
            <div className="location-empty">
              No matching location found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   TICKETS CONTENT
===================================================== */

function TicketsContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [result, setResult] =
    useState({
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const query =
    searchParams.toString();

  /* ---------------------------------
     LOAD TICKETS
  --------------------------------- */

  useEffect(() => {
    let active = true;

    setLoading(true);

    fetch(
      `${API_URL}/tickets?${query}`
    )
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(
              new Error(
                "Unable to load tickets"
              )
            )
      )
      .then((data) => {
        if (active) {
          setResult(data);
        }
      })
      .catch(() => {
        if (active) {
          setResult({
            data: [],
            page: 1,
            totalPages: 1,
            total: 0,
          });
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
  }, [query]);

  /* ---------------------------------
     UPDATE URL SEARCH
  --------------------------------- */

  function update(values) {
    const params =
      new URLSearchParams(
        searchParams
      );

    Object.entries(values).forEach(
      ([key, value]) => {
        if (
          value &&
          value !== "all"
        ) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
    );

    params.set(
      "page",
      values.page || "1"
    );

    router.push(
      `/tickets?${params.toString()}`
    );
  }

  /* ---------------------------------
     SEARCH
  --------------------------------- */

  function search(event) {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    update({
      from:
        formData.get("from") || "",
      to:
        formData.get("to") || "",
    });
  }

  return (
    <>
      {/* =================================
          HERO / SEARCH
      ================================= */}

      <section className="listing-head">
        <div className="container">
          <span className="eyebrow">
            Find your next departure
          </span>

          <h1 className="display">
            Every journey, one search away.
          </h1>

          <p>
            Only admin-approved departures
            from verified operators are shown.
          </p>

          <form
            onSubmit={search}
            className="listing-search glass"
          >
            <LocationAutocomplete
              key={`from-${
                searchParams.get("from") ||
                ""
              }`}
              name="from"
              label="From"
              placeholder="Dhaka"
              defaultValue={
                searchParams.get(
                  "from"
                ) || ""
              }
            />

            <LocationAutocomplete
              key={`to-${
                searchParams.get("to") ||
                ""
              }`}
              name="to"
              label="To"
              placeholder="Sylhet"
              defaultValue={
                searchParams.get(
                  "to"
                ) || ""
              }
            />

            <button type="submit">
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* =================================
          RESULTS
      ================================= */}

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div>
              <Filter size={18} />

              <b>
                {result.total}
              </b>

              journeys found
            </div>

            <div>
              <label>
                <span className="sr-only">
                  Transport type
                </span>

                <select
                  value={
                    searchParams.get(
                      "transport"
                    ) || "all"
                  }
                  onChange={(event) =>
                    update({
                      transport:
                        event.target
                          .value,
                    })
                  }
                >
                  <option value="all">
                    All transport
                  </option>

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

              <label>
                <span className="sr-only">
                  Sort price
                </span>

                <select
                  value={
                    searchParams.get(
                      "sort"
                    ) || "latest"
                  }
                  onChange={(event) =>
                    update({
                      sort:
                        event.target
                          .value,
                    })
                  }
                >
                  <option value="latest">
                    Newest first
                  </option>

                  <option value="price-asc">
                    Price: low to high
                  </option>

                  <option value="price-desc">
                    Price: high to low
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* =============================
              LOADING
          ============================= */}

          {loading ? (
            <div className="grid-cards">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    className="skeleton-card"
                    key={item}
                  />
                )
              )}
            </div>
          ) : result.data.length ? (
            <>
              {/* =========================
                  TICKETS
              ========================= */}

              <div className="grid-cards">
                {result.data.map(
                  (ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                    />
                  )
                )}
              </div>

              {/* =========================
                  PAGINATION
              ========================= */}

              <div className="pagination">
                <button
                  disabled={
                    result.page <= 1
                  }
                  onClick={() =>
                    update({
                      page: String(
                        result.page -
                          1
                      ),
                    })
                  }
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length:
                      result.totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    className={
                      page ===
                      result.page
                        ? "current"
                        : ""
                    }
                    onClick={() =>
                      update({
                        page:
                          String(
                            page
                          ),
                      })
                    }
                    key={page}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={
                    result.page >=
                    result.totalPages
                  }
                  onClick={() =>
                    update({
                      page: String(
                        result.page +
                          1
                      ),
                    })
                  }
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty">
              <SlidersHorizontal />

              <h3>
                No matching tickets
              </h3>

              <p className="muted">
                Try a broader route or
                another transport type.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function TicketsPage() {
  return (
    <Suspense>
      <TicketsContent />
    </Suspense>
  );
}