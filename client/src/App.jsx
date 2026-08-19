import { useCallback, useEffect, useState } from 'react';
import { createUrl, deleteUrl, getUrls } from './api.js';
import Brand from './components/Brand.jsx';
import LinkList from './components/LinkList.jsx';
import ResultCard from './components/ResultCard.jsx';
import UrlForm from './components/UrlForm.jsx';

export default function App() {
  const [links, setLinks] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadLinks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const urls = await getUrls();
      setLinks(urls);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    getUrls()
      .then((urls) => {
        if (isCurrent) {
          setLinks(urls);
        }
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleCreate(url) {
    setIsSubmitting(true);
    setError('');

    try {
      const created = await createUrl(url);
      setLatestResult(created);
      setLinks((current) => [created, ...current.filter((link) => link.shortCode !== created.shortCode)]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(shortCode) {
    setError('');

    try {
      await deleteUrl(shortCode);
      setLinks((current) => current.filter((link) => link.shortCode !== shortCode));
      setLatestResult((current) => current?.shortCode === shortCode ? null : current);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  return (
    <div id="top" className="app-shell">
      <header className="site-header">
        <Brand />
        <a className="github-link" href="https://github.com/tejuk1907/url-shortener" target="_blank" rel="noreferrer">
          GitHub
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="hero-kicker"><span /> Fast. Clean. Free.</p>
          <h1 id="hero-title">Long links,<br /><em>made little.</em></h1>
          <p className="hero-copy">Turn unwieldy URLs into short, shareable links—without the clutter.</p>
          <UrlForm isSubmitting={isSubmitting} onSubmit={handleCreate} />
          {error && (
            <div className="error-banner" role="alert">
              <span aria-hidden="true">!</span>
              <p>{error}</p>
              <button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button>
            </div>
          )}
          {latestResult && <ResultCard key={latestResult.shortCode} result={latestResult} />}
        </section>

        <section className="links-section" aria-labelledby="links-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h2 id="links-heading">Recent links</h2>
            </div>
            <p>{links.length} {links.length === 1 ? 'link' : 'links'}</p>
          </div>
          <LinkList isLoading={isLoading} links={links} onDelete={handleDelete} onRetry={loadLinks} />
        </section>
      </main>

      <footer>
        <Brand />
        <p>Shorter links. Bigger possibilities.</p>
        <p>Built with React + Express.</p>
      </footer>
    </div>
  );
}
