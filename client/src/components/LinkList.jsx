import { useState } from 'react';

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function LinkRow({ link, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    const succeeded = await onDelete(link.shortCode);
    if (!succeeded) {
      setIsDeleting(false);
    }
  }

  return (
    <article className="link-row">
      <div className="link-main">
        <a className="short-link" href={link.shortUrl} target="_blank" rel="noreferrer">{link.shortUrl}</a>
        <p className="long-link" title={link.originalUrl}>{link.originalUrl}</p>
      </div>
      <div className="link-meta">
        <span><strong>{link.clicks ?? 0}</strong> clicks</span>
        <span>{formatDate(link.createdAt)}</span>
      </div>
      <div className="row-actions">
        <button className="icon-button copy-icon" type="button" onClick={handleCopy} aria-label={`Copy ${link.shortUrl}`} title="Copy short link">
          {copied ? '✓' : (
            <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" /></svg>
          )}
        </button>
        <button className="icon-button delete-icon" type="button" onClick={handleDelete} disabled={isDeleting} aria-label={`Delete ${link.shortUrl}`} title="Delete link">
          {isDeleting ? <span className="small-loader" aria-hidden="true" /> : (
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
          )}
        </button>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{copied ? `${link.shortUrl} copied.` : ''}</span>
    </article>
  );
}

export default function LinkList({ isLoading, links, onDelete, onRetry }) {
  if (isLoading) {
    return (
      <div className="list-loading" role="status">
        <span className="page-loader" aria-hidden="true" />
        <p>Loading your links…</p>
      </div>
    );
  }

  if (!links.length) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">↗</span>
        <h3>No links yet</h3>
        <p>Your shortened links will appear here. Paste one above to get started.</p>
        <button className="text-button" type="button" onClick={onRetry}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="link-list">
      {links.map((link) => (
        <LinkRow key={link.id || link.shortCode} link={link} onDelete={onDelete} />
      ))}
    </div>
  );
}
