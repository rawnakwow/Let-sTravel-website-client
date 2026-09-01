"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BusFront,
  CalendarDays,
  MapPin,
  Pause,
  Plane,
  Play,
  Search,
  Ship,
  Sparkles,
  TrainFront,
} from "lucide-react";

const slides = [
  {
    slug: "bus",
    label: "Bus",
    apiType: "Bus",
    icon: BusFront,
    eyebrow:
      "Road journeys, minus the hassle",
    title:
      "City to city, without the queue.",
    text:
      "Compare verified coaches, departure times and comfort perks before you choose your seat.",
    from: "Dhaka",
    to: "Chattogram",
    duration: "6h 30m",
    note:
      "AC · Wi-Fi · Recliner",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=88",
  },

  {
    slug: "plane",
    label: "Plane",
    apiType: "Plane",
    icon: Plane,
    eyebrow:
      "Fast connections across Bangladesh",
    title:
      "More sky. Less waiting.",
    text:
      "Find domestic flights in one focused view, with transparent fares and verified departures.",
    from: "Dhaka",
    to: "Cox's Bazar",
    duration: "1h 05m",
    note:
      "Cabin bag · Meal · Support",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=88",
  },

  {
    slug: "cruise",
    label: "Cruise",
    apiType: "Launch",
    icon: Ship,
    eyebrow:
      "River travel, reimagined",
    title:
      "Let the river set the pace.",
    text:
      "Discover launch and cruise-style journeys with clear schedules, cabin details and easy booking requests.",
    from: "Dhaka",
    to: "Barishal",
    duration: "7h 20m",
    note:
      "Cabin · Deck view · Dining",
    image:
      "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1800&q=88",
  },

  {
    slug: "train",
    label: "Train",
    apiType: "Train",
    icon: TrainFront,
    eyebrow:
      "A calmer way across the country",
    title:
      "Take the scenic route.",
    text:
      "Browse verified rail departures, compare prices and keep every booking detail in one place.",
    from: "Dhaka",
    to: "Sylhet",
    duration: "5h 15m",
    note:
      "AC chair · Luggage · Dining",
    image:
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1800&q=88",
  },
];

export default function HeroSlider() {
  const router = useRouter();

  const [active, setActive] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const slide =
    slides[active];

  const Icon =
    slide.icon;

  /* =====================================================
     AUTOMATIC SLIDER
  ===================================================== */

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActive(
          (current) =>
            (current + 1) %
            slides.length
        );
      }, 6500);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [isPaused]);

  /* =====================================================
     PROGRESS
  ===================================================== */

  const progress =
    useMemo(
      () =>
        `${
          ((active + 1) /
            slides.length) *
          100
        }%`,
      [active]
    );

  /* =====================================================
     CHANGE SLIDE
  ===================================================== */

  function changeSlide(
    direction
  ) {
    setActive(
      (current) =>
        (current +
          direction +
          slides.length) %
        slides.length
    );
  }

  /* =====================================================
     PAUSE / PLAY
  ===================================================== */

  function togglePause() {
    setIsPaused(
      (current) =>
        !current
    );
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  function search(event) {
    event.preventDefault();

    const params =
      new URLSearchParams(
        new FormData(
          event.currentTarget
        )
      );

    params.set(
      "transport",
      slide.apiType
    );

    router.push(
      `/tickets?${params.toString()}`
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section
      className={`hero-slider hero-mode-${slide.slug}`}
      aria-label="Travel mode highlights"
    >
      {/* ===============================================
          BACKGROUND
      =============================================== */}

      <div
        className="hero-backdrop"
        style={{
          backgroundImage:
            `url(${slide.image})`,
        }}
      />

      <div className="hero-overlay" />

      {/* ===============================================
          MAIN CONTENT
      =============================================== */}

      <div className="container hero-slide-layout">
        {/* =============================================
            LEFT CONTENT
        ============================================= */}

        <div className="hero-slider-copy">
          <span className="hero-badge">
            <Sparkles
              size={15}
            />

            {slide.eyebrow}
          </span>

          {/* SLIDE INDEX */}

          <div className="hero-index">
            <span>
              0{active + 1}
            </span>

            <i />

            <span>
              0{slides.length}
            </span>
          </div>

          {/* TITLE */}

          <h1 className="display">
            {slide.title}
          </h1>

          <p>
            {slide.text}
          </p>

          {/* ===========================================
              SEARCH
          =========================================== */}

          <form
            className="hero-search hero-search-dark"
            onSubmit={search}
          >
            <label>
              <span>
                Leaving from
              </span>

              <input
                name="from"
                defaultValue={
                  slide.from
                }
                key={`${slide.slug}-from`}
              />
            </label>

            <label>
              <span>
                Going to
              </span>

              <input
                name="to"
                defaultValue={
                  slide.to
                }
                key={`${slide.slug}-to`}
              />
            </label>

            <button
              type="submit"
              aria-label={`Search ${slide.label} tickets`}
            >
              <Search
                size={20}
              />
            </button>
          </form>

          {/* ===========================================
              QUICK LINKS
          =========================================== */}

          <div className="hero-quick-links">
            <Link
              href={`/${slide.slug}`}
            >
              Explore{" "}
              {slide.label}{" "}
              tickets

              <ArrowRight
                size={16}
              />
            </Link>

            <span>
              Verified listings
              only
            </span>
          </div>
        </div>

        {/* =============================================
            RIGHT JOURNEY CARD
        ============================================= */}

        <aside className="journey-glass-card">
          {/* MODE */}

          <div className="journey-mode">
            <span>
              <Icon />
            </span>

            <div>
              <small>
                Featured mode
              </small>

              <b>
                {slide.label}
              </b>
            </div>
          </div>

          {/* ROUTE */}

          <div className="journey-route">
            <div>
              <span className="route-dot" />

              <small>
                From
              </small>

              <b>
                {slide.from}
              </b>
            </div>

            <div className="route-line">
              <i />

              <Icon
                size={18}
              />

              <i />
            </div>

            <div>
              <span className="route-dot destination" />

              <small>
                To
              </small>

              <b>
                {slide.to}
              </b>
            </div>
          </div>

          {/* META */}

          <div className="journey-meta">
            <div>
              <CalendarDays />

              <span>
                <small>
                  Typical journey
                </small>

                <b>
                  {slide.duration}
                </b>
              </span>
            </div>

            <div>
              <MapPin />

              <span>
                <small>
                  Comfort snapshot
                </small>

                <b>
                  {slide.note}
                </b>
              </span>
            </div>
          </div>

          {/* CTA */}

          <Link
            className="journey-cta"
            href={`/${slide.slug}`}
          >
            View{" "}
            {slide.label} page

            <ArrowRight
              size={17}
            />
          </Link>
        </aside>
      </div>

      {/* ===============================================
          BOTTOM CONTROLS
      =============================================== */}

      <div className="container hero-slider-controls">
        {/* =============================================
            MODE TABS
        ============================================= */}

        <div
          className="hero-mode-tabs"
          role="tablist"
          aria-label="Choose travel mode"
        >
          {slides.map(
            (
              item,
              index
            ) => {
              const TabIcon =
                item.icon;

              return (
                <button
                  key={
                    item.slug
                  }
                  type="button"
                  role="tab"
                  aria-selected={
                    active ===
                    index
                  }
                  className={
                    active ===
                    index
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActive(
                      index
                    )
                  }
                >
                  <TabIcon
                    size={17}
                  />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* =============================================
            PROGRESS
        ============================================= */}

        <div className="hero-progress">
          <span
            style={{
              width:
                progress,
            }}
          />
        </div>

        {/* =============================================
            ARROWS + PAUSE
        ============================================= */}

        <div className="hero-arrows">
          {/* PREVIOUS */}

          <button
            type="button"
            aria-label="Previous slide"
            title="Previous"
            onClick={() =>
              changeSlide(-1)
            }
          >
            <ArrowLeft />
          </button>

          {/* PAUSE / PLAY */}

          <button
            type="button"
            className="hero-pause-control"
            aria-label={
              isPaused
                ? "Play slideshow"
                : "Pause slideshow"
            }
            title={
              isPaused
                ? "Play"
                : "Pause"
            }
            aria-pressed={
              isPaused
            }
            onClick={
              togglePause
            }
          >
            {isPaused ? (
              <Play
                size={19}
                fill="currentColor"
              />
            ) : (
              <Pause
                size={19}
              />
            )}
          </button>

          {/* NEXT */}

          <button
            type="button"
            aria-label="Next slide"
            title="Next"
            onClick={() =>
              changeSlide(1)
            }
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}