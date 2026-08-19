import { useState } from 'react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  async function copyShortUrl() {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="result-card" aria-labelledby="result-title">
      <div className="success-icon" aria-hidden="true">✓</div>
      <div className="result-content">
        <p id="result-title" className="eyebrow">Your short link is ready</p>
        <a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
        <p className="result-original" title={result.originalUrl}>{result.originalUrl}</p>
      </div>
      <button className={`copy-button ${copied ? 'copy-button--copied' : ''}`} type="button" onClick={copyShortUrl}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? 'Short link copied to clipboard.' : ''}</span>
    </section>
  );
}
