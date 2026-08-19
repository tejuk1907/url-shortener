import { useState } from 'react';

function validateUrl(value) {
  if (!value.trim()) {
    return 'Enter a URL to shorten.';
  }

  try {
    const parsed = new URL(value.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Use a URL that starts with http:// or https://.';
    }
  } catch {
    return 'Enter a complete, valid URL.';
  }

  return '';
}

export default function UrlForm({ isSubmitting, onSubmit }) {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const error = validateUrl(url);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');
    const succeeded = await onSubmit(url.trim());
    if (succeeded) {
      setUrl('');
    }
  }

  function handleChange(event) {
    setUrl(event.target.value);
    if (validationError) {
      setValidationError('');
    }
  }

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <label htmlFor="long-url">Paste your long link</label>
        <div className={`input-shell ${validationError ? 'input-shell--error' : ''}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.25 1.25M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.25-1.25" />
          </svg>
          <input
            id="long-url"
            type="url"
            value={url}
            onChange={handleChange}
            placeholder="https://your-very-long-link.com/goes-here"
            aria-describedby={validationError ? 'url-error' : 'url-hint'}
            aria-invalid={Boolean(validationError)}
            autoComplete="url"
          />
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="button-loader" aria-hidden="true" /> : 'Shorten link'}
            <span className="sr-only">{isSubmitting ? 'Shortening link' : ''}</span>
          </button>
        </div>
        {validationError ? (
          <p id="url-error" className="field-message field-message--error">{validationError}</p>
        ) : (
          <p id="url-hint" className="field-message">Only public HTTP and HTTPS links are supported.</p>
        )}
      </div>
    </form>
  );
}
