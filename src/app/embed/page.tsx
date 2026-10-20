'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/hardware/HardwareExplorer';
import '@/components/hardware/explorer.css';
import GpuEmbed from '@/components/GpuEmbed';
import styles from '@/components/Embed.module.css';

export default function EmbedPage() {
  const [selectedModel, setSelectedModel] = useState<'gpu' | 'cpu' | 'motherboard'>('gpu');

  return (
    <div className="explorer legacy-embed">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="3DHV home"><LogoMark /><span>3dhv.</span></Link>
        <Link href="/">Back to the hardware lab</Link>
      </header>
      <main>
      <div className={styles.embedContainer}>
        <h1 className={styles.embedTitle}>3D Component Viewer</h1>
        <p className={styles.embedSubtitle}>
          Explore 3D models of computer components. Use your mouse to rotate, zoom, and pan.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              background: selectedModel === 'gpu' ? 'var(--primary-color)' : 'var(--card-bg)',
              color: selectedModel === 'gpu' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedModel('gpu')}
          >
            GPU
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              background: selectedModel === 'cpu' ? 'var(--primary-color)' : 'var(--card-bg)',
              color: selectedModel === 'cpu' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedModel('cpu')}
          >
            CPU
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              background: selectedModel === 'motherboard' ? 'var(--primary-color)' : 'var(--card-bg)',
              color: selectedModel === 'motherboard' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedModel('motherboard')}
          >
            Motherboard
          </button>
        </div>

        {selectedModel === 'gpu' && (
          <GpuEmbed
            modelId="b0b6188359824233a939936032647752"
            title="Graphics Card GPU"
            author="davidp92"
          />
        )}

        {selectedModel === 'cpu' && (
          <GpuEmbed
            modelId="6c50e56659964582a7c9a5a2a50c6726"
            title="CPU Processor"
            author="davidp92"
          />
        )}

        {selectedModel === 'motherboard' && (
          <GpuEmbed
            modelId="250b53d104da4d01ac28e333ebe8a8bb"
            title="Mother Board"
            author="grisinamaria144"
          />
        )}
      </div>
    </main>
    </div>
  );
}
