"use client";

import React from "react";
import styles from "./SketchfabEmbed.module.css";

export interface SketchfabEmbedProps {
  /** Sketchfab model unique identifier */
  modelId?: string;
  /** Title for accessibility and attribution */
  title?: string;
  /** Author name for attribution */
  author?: string;
  /** Direct link to the author's Sketchfab profile */
  authorUrl?: string;
  /** Optional custom model page link */
  modelUrl?: string;
  /** Additional custom container CSS class name */
  className?: string;
  /** Optional custom iframe element to be cloned and styled via React.cloneElement */
  children?: React.ReactElement<React.IframeHTMLAttributes<HTMLIFrameElement>>;
}

/**
 * SketchfabEmbed Component
 *
 * Responsively embeds a Sketchfab 3D model iframe with proper aspect ratio,
 * studio styling, accessibility attributes, and required author attribution.
 */
export function SketchfabEmbed({
  modelId = "250b53d104da4d01ac28e333ebe8a8bb",
  title = "Computer Motherboard",
  author = "Sketchfab Creator",
  authorUrl,
  modelUrl,
  className = "",
  children,
}: SketchfabEmbedProps) {
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed`;
  const resolvedModelUrl =
    modelUrl ||
    `https://sketchfab.com/3d-models/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${modelId}`;
  const resolvedAuthorUrl = authorUrl || `https://sketchfab.com`;

  // Default iframe element with accessibility and interactive permissions
  const defaultIframe = (
    <iframe
      title={title}
      src={embedUrl}
      className={styles.iframe}
      allow="autoplay; fullscreen; xr-spatial-tracking"
      allowFullScreen
      aria-label={`${title} 3D interactive viewer`}
    />
  );

  // If a child iframe is passed, clone it to apply wrapper styling and accessibility; otherwise use default iframe
  const iframeContent = children
    ? React.cloneElement(children, {
        className: `${styles.iframe} ${children.props.className || ""}`.trim(),
        title: children.props.title || title,
        allowFullScreen: children.props.allowFullScreen ?? true,
      })
    : defaultIframe;

  return (
    <div
      className={`${styles.sketchfabContainer} ${className}`.trim()}
      aria-label="3D model viewer container"
    >
      {/* Wrapper div maintaining 16:9 responsive aspect ratio */}
      <div className={styles.iframeWrapper}>{iframeContent}</div>

      {/* Model author & Sketchfab attribution section */}
      <div className={styles.attribution}>
        <span>Model:</span>
        <a
          href={resolvedModelUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={styles.link}
        >
          {title}
        </a>
        <span>by</span>
        <a
          href={resolvedAuthorUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={styles.authorLink}
        >
          {author}
        </a>
        <span>on</span>
        <a
          href="https://sketchfab.com"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={styles.link}
        >
          Sketchfab
        </a>
      </div>
    </div>
  );
}

export default SketchfabEmbed;
