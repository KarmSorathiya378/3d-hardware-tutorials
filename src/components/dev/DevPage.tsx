"use client";

import { useState } from "react";
import Link from "next/link";
import { DEVELOPERS, PROJECT_SPECS, type Developer } from "./dev-data";
import "./dev.css";

// Clean inline SVG Icons
function Icon({ name }: { name: "mail" | "phone" | "linkedin" | "github" | "copy" | "check" | "arrow" | "code" }) {
  switch (name) {
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="contact-icon" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="contact-icon" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74V9.97H5.06v8.53h2.8z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "copy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

export default function DevPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  return (
    <div className="dev-page">
      {/* Top bar header */}
      <header className="dev-header">
        <div className="dev-badge">
          <span className="dev-badge-dot" />
          <span>Core Engineering & Design</span>
        </div>
        <Link href="/" aria-label="Return to 3D Hardware Explorer">
          <span>Explore 3D Hardware</span>
          <span style={{ display: "inline-block", transform: "translateY(1px)" }}>→</span>
        </Link>
      </header>

      {/* Hero Intro */}
      <section className="dev-intro">
        <h1>Meet the developers behind 3DHV.</h1>
        <p>
          3DHV is an open educational lab built to demystify computer hardware. We combined
          Three.js spatial graphics, photographic hardware modeling, and structured assessment
          into an accessible web experience.
        </p>
      </section>

      {/* Developer Profile Cards */}
      <section className="dev-grid-section">
        <span className="section-label">Engineering Contributors</span>
        <div className="dev-cards">
          {DEVELOPERS.map((dev: Developer) => {
            const initials = dev.avatarInitials || dev.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <article key={dev.id} className="dev-card">
                <div className="dev-card-top">
                  <div className="dev-avatar" aria-hidden="true">
                    {initials}
                  </div>
                  <div className="dev-meta">
                    <h2>{dev.name}</h2>
                    <p className="dev-role">{dev.role}</p>
                  </div>
                </div>

                {dev.tagline && (
                  <blockquote className="dev-tagline">“{dev.tagline}”</blockquote>
                )}

                {dev.bio && <p className="dev-bio">{dev.bio}</p>}

                {dev.skills && dev.skills.length > 0 && (
                  <div className="dev-skills">
                    {dev.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Architecture & Engineering Highlights */}
      <section className="dev-specs-section">
        <span className="section-label">Architecture Highlights</span>
        <div className="dev-specs-grid">
          {PROJECT_SPECS.map((spec) => (
            <div key={spec.label} className="spec-item">
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{spec.value}</span>
              <span className="spec-detail">{spec.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================
          THE DEV FOOTER: Structured, Prominent Contacts
          Contains Name, Email, Phone Number, LinkedIn ID
          ========================================================== */}
      <footer className="dev-footer" id="dev-contact">
        <div className="dev-footer-intro">
          <div>
            <h2>Developer Contacts</h2>
            <p>
              Have questions, feedback, or collaboration proposals? Reach out directly via
              email, phone, or LinkedIn.
            </p>
          </div>
          <div className="dev-status-indicator">
            <span className="dev-status-pulse" />
            <span>Available for collaborations & queries</span>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="dev-footer-contacts-grid">
          {DEVELOPERS.map((dev: Developer) => {
            const emailKey = `${dev.id}-email`;
            const phoneKey = `${dev.id}-phone`;
            const isEmailCopied = copiedKey === emailKey;
            const isPhoneCopied = copiedKey === phoneKey;

            return (
              <div key={dev.id} className="dev-contact-card">
                <div className="dev-contact-card-header">
                  <div>
                    <h3>{dev.name}</h3>
                    <span>{dev.role}</span>
                  </div>
                  {dev.location && <span>{dev.location}</span>}
                </div>

                <div className="dev-contact-details">
                  {/* Email */}
                  <div className="contact-row">
                    <div className="contact-row-left">
                      <Icon name="mail" />
                      <div className="contact-text-group">
                        <span className="contact-label">Email</span>
                        <a
                          href={`mailto:${dev.email}`}
                          className="contact-link"
                          title={`Send an email to ${dev.email}`}
                        >
                          {dev.email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(dev.email, emailKey)}
                      className={`contact-action-btn ${isEmailCopied ? "copied" : ""}`}
                      aria-label={`Copy ${dev.name}'s email`}
                    >
                      {isEmailCopied ? (
                        <>
                          <Icon name="check" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Icon name="copy" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone Number */}
                  <div className="contact-row">
                    <div className="contact-row-left">
                      <Icon name="phone" />
                      <div className="contact-text-group">
                        <span className="contact-label">Phone</span>
                        <a
                          href={`tel:${dev.phone.replace(/[^+\d]/g, "")}`}
                          className="contact-link"
                          title={`Call ${dev.phone}`}
                        >
                          {dev.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(dev.phone, phoneKey)}
                      className={`contact-action-btn ${isPhoneCopied ? "copied" : ""}`}
                      aria-label={`Copy ${dev.name}'s phone number`}
                    >
                      {isPhoneCopied ? (
                        <>
                          <Icon name="check" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Icon name="copy" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="contact-row linkedin-row">
                    <div className="contact-row-left">
                      <Icon name="linkedin" />
                      <div className="contact-text-group">
                        <span className="contact-label">LinkedIn</span>
                        <a
                          href={dev.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link"
                          title={`Visit ${dev.name}'s LinkedIn Profile`}
                        >
                          in/{dev.linkedInHandle || dev.linkedInUrl.split("/in/")[1]?.replace(/\/$/, "") || "profile"}
                        </a>
                      </div>
                    </div>
                    <a
                      href={dev.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-action-btn linkedin-btn"
                    >
                      <span>Connect</span>
                      <Icon name="arrow" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Bottom Bar */}
        <div className="dev-footer-bottom">
          <div className="dev-footer-tag">
            <span>3DHV — Interactive Computer Hardware Explorer</span>
          </div>
          <div>
            <Link href="/" className="back-link">
              Back to 3D Models ↑
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
