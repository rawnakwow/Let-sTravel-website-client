"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  apiFetch,
  uploadImage,
} from "@/lib/api";

/* =========================
   GENERATE NAME INITIALS
========================= */

function getInitials(name = "") {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "LV";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    let active = true;

    apiFetch("/users/me")
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* =========================
     CHANGE PROFILE PHOTO
  ========================= */

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be smaller than 5 MB"
      );
      return;
    }

    setUploading(true);

    try {
      const imageUrl =
        await uploadImage(file);

      await apiFetch(
        "/users/me/profile-image",
        {
          method: "PATCH",

          body: JSON.stringify({
            profileImage: imageUrl,
          }),
        }
      );

      setProfile((current) => ({
        ...current,
        profileImage: imageUrl,
      }));

      toast.success(
        "Profile photo updated"
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  /* =========================
     REMOVE PROFILE PHOTO
  ========================= */

  async function removePhoto() {
    try {
      setUploading(true);

      await apiFetch(
        "/users/me/profile-image",
        {
          method: "PATCH",

          body: JSON.stringify({
            profileImage: "",
          }),
        }
      );

      setProfile((current) => ({
        ...current,
        profileImage: "",
      }));

      toast.success(
        "Profile photo removed"
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  if (!profile) {
    return <div className="spinner" />;
  }

  const joinedDate =
    profile.createdAt
      ? new Date(
          profile.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        )
      : "";

  const initials =
    getInitials(profile.name);

  return (
    <div className="profile-page">
      <div className="profile-hero surface">
        {/* =========================
            COVER
        ========================= */}

        <div className="profile-cover">
          <div className="profile-cover-overlay" />
        </div>

        {/* =========================
            PROFILE INFORMATION
        ========================= */}

        <div className="profile-hero-content">
          <div className="profile-avatar-area">

            {/* PROFILE AVATAR */}
            <div className="profile-main-avatar">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={
                    profile.name ||
                    "Profile"
                  }
                />
              ) : (
                <span>
                  {initials}
                </span>
              )}
            </div>

            {/* EDIT / ADD PHOTO */}
            <button
              type="button"
              className="profile-edit-photo"
              disabled={uploading}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <Camera size={15} />

              {uploading
                ? "Uploading..."
                : profile.profileImage
                  ? "Change Photo"
                  : "Add Photo"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={
                handlePhotoChange
              }
            />
          </div>

          {/* =========================
              NAME + ROLE
          ========================= */}

          <div className="profile-heading">
            <span className="profile-role">
              {profile.role || "User"}
            </span>

            <h1 className="display">
              {profile.name}
            </h1>

            {joinedDate && (
              <p>
                Member since{" "}
                {joinedDate}
              </p>
            )}
          </div>

          {/* REMOVE PHOTO */}
          {profile.profileImage && (
            <button
              type="button"
              className="profile-remove-photo"
              disabled={uploading}
              onClick={
                removePhoto
              }
            >
              <Trash2 size={15} />
              Remove photo
            </button>
          )}
        </div>
      </div>

      {/* =========================
          PROFILE DETAILS
      ========================= */}

      <div className="profile-details surface">
        <div>
          <span>Name</span>

          <b>
            {profile.name}
          </b>
        </div>

        <div>
          <span>Email</span>

          <b>
            {profile.email}
          </b>
        </div>

        <div>
          <span>Role</span>

          <b>
            {profile.role ||
              "User"}
          </b>
        </div>

        <div>
          <span>
            Profile picture
          </span>

          <b>
            {profile.profileImage
              ? "Custom photo"
              : `Default ${initials} avatar`}
          </b>
        </div>
      </div>
    </div>
  );
}