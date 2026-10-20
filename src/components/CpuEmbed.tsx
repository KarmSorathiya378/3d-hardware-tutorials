'use client';

import { useState } from 'react';
import styles from './CpuEmbed.module.css';

export interface CpuEmbedProps {
  modelId?: string;
  title?: string;
  author?: string;
  width?: string;
  height?: string;
}

export default function CpuEmbed({
  modelId = '6546273e88b246688667621c5f59e472',
  title = 'CPU Processor',
  author = 'kennymccormick',
  width = '100%',
  height = '500px',
}: CpuEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className={styles.error}>
        <p>Unable to load 3D CPU model</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.embedWrapper} style={{ width, height }}>
      <iframe
        title={title}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src={`https://sketchfab.com/models/${modelId}/embed`}
        onLoad={() => setLoaded(true)}
        onError={() => setError('Failed to load Sketchfab viewer')}
      />
      {!loaded && (
        <div className={styles.loading}>
          <p>Loading CPU 3D Model...</p>
        </div>
      )}
      <p className={styles.credit}>
        <a
          href={`https://sketchfab.com/3d-models/${title.toLowerCase().replace(/ /g, '-')}-${modelId}`}
          target="_blank"
          rel="nofollow"
        >
          {title}
        </a>
        {' by '}
        <a
          href={`https://sketchfab.com/${author}`}
          target="_blank"
          rel="nofollow"
        >
          {author}
        </a>
        {' on '}
        <a
          href="https://sketchfab.com"
          target="_blank"
          rel="nofollow"
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
}

export { CpuEmbed };
