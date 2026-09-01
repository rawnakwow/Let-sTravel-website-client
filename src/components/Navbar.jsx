"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BusFront,
  ChevronDown,
  House,
  LayoutDashboard,
  Menu,
  Plane,
  Ship,
  Ticket,
  TrainFront,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { authClient } from "@/lib/auth-client";

import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

/* =====================================================
   NAVIGATION LINKS
===================================================== */

const mainLinks = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/bus",
    label: "Bus",
    icon: BusFront,
    mode: "bus",
  },
  {
    href: "/plane",
    label: "Plane",
    icon: Plane,
    mode: "plane",
  },
  {
    href: "/train",
    label: "Train",
    icon: TrainFront,
    mode: "train",
  },
  {
    href: "/cruise",
    label: "Cruise",
    icon: Ship,
    mode: "cruise",
  },
  {
    href: "/tickets",
    label: "All tickets",
    icon: Ticket,
  },
];

/* =====================================================
   NAVBAR
===================================================== */

export default function Navbar() {
  const pathname = usePathname();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  /* ===================================================
     NAV LINKS
  =================================================== */

  const navLinks = user
    ? [
        ...mainLinks,
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ]
    : mainLinks;

  /* ===================================================
     CLOSE MENUS AFTER ROUTE CHANGE
  =================================================== */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  /* ===================================================
     CLOSE PROFILE MENU
  =================================================== */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }

    /*
     * Important:
     * closes profile dropdown when page scrolls.
     * This prevents the dropdown becoming visually
     * detached from the navbar.
     */
    function handleScroll() {
      setProfileOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ===================================================
     ACTIVE NAV
  =================================================== */

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  /* ===================================================
     LOGOUT
  =================================================== */

  async function handleLogout() {
    try {
      setProfileOpen(false);
      setMobileOpen(false);

      await authClient.signOut();

      window.location.href = "/";
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  /* ===================================================
     USER DISPLAY NAME
  =================================================== */

  const displayName =
    user?.name?.trim() ||
    "Traveller";

  /*
   * Screenshot style:
   * "Rawnak Ahmed" -> "Rawnak"
   */
  const shortName =
    displayName
      .split(/\s+/)
      .filter(Boolean)[0] ||
    "Traveller";

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <header className="site-nav">
      <div className="container nav-inner">
        {/* ============================================
            LOGO
        ============================================ */}

        <Link
          href="/"
          className="brand nav-brand"
          aria-label="Let'sTravel home"
          onClick={() => {
            setMobileOpen(false);
            setProfileOpen(false);
          }}
        >
          <BrandLogo />
        </Link>

        {/* ============================================
            DESKTOP / MOBILE NAV LINKS
        ============================================ */}

        <nav
          className={`nav-links ${
            mobileOpen
              ? "is-open"
              : ""
          }`}
          aria-label="Primary navigation"
        >
          {navLinks.map(
            ({
              href,
              label,
              icon: Icon,
              mode,
            }) => (
              <Link
                key={href}
                href={href}
                data-mode={mode}
                className={`nav-link ${
                  isActive(href)
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setMobileOpen(false);
                  setProfileOpen(false);
                }}
              >
                <span
                  className="nav-link-icon"
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>

                <span>
                  {label}
                </span>
              </Link>
            )
          )}

          {/* MOBILE LOGIN */}

          {!user &&
            !isPending && (
              <div className="mobile-auth">
                <Link
                  href="/login"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="btn btn-primary"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                >
                  Create account
                </Link>
              </div>
            )}
        </nav>

        {/* ============================================
            RIGHT SIDE
        ============================================ */}

        <div className="nav-actions">
          {/* THEME */}

          <ThemeToggle />

          {/* ==========================================
              NOT LOGGED IN
          ========================================== */}

          {!isPending &&
            !user && (
              <div className="desktop-auth">
                <Link href="/login">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="btn btn-primary"
                >
                  Create account
                </Link>
              </div>
            )}

          {/* ==========================================
              LOGGED IN USER
          ========================================== */}

          {!isPending &&
            user && (
              <div
                className="profile-menu"
                ref={profileRef}
              >
                {/* PROFILE TRIGGER */}

                <button
                  type="button"
                  className={`profile-trigger ${
                    profileOpen
                      ? "is-open"
                      : ""
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={
                    profileOpen
                  }
                  aria-label="Open profile menu"
                  onClick={() => {
                    setProfileOpen(
                      (current) =>
                        !current
                    );

                    setMobileOpen(false);
                  }}
                >
                  <UserAvatar
                    name={
                      displayName
                    }
                    src={
                      user.image ||
                      null
                    }
                    size={34}
                  />

                  <span className="profile-trigger-name">
                    {shortName}
                  </span>

                  <ChevronDown
                    size={15}
                    className="profile-chevron"
                  />
                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (
                  <div
                    className="profile-pop"
                    role="menu"
                  >
                    <Link
                      href="/dashboard/profile"
                      role="menuitem"
                      onClick={() =>
                        setProfileOpen(
                          false
                        )
                      }
                    >
                      My profile
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={
                        handleLogout
                      }
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* ==========================================
              MOBILE MENU BUTTON
          ========================================== */}

          <button
            type="button"
            className="menu-toggle"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              mobileOpen
            }
            onClick={() => {
              setMobileOpen(
                (current) =>
                  !current
              );

              setProfileOpen(false);
            }}
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}