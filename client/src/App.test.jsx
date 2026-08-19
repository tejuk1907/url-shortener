// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App.jsx';
import * as api from './api.js';

vi.mock('./api.js', () => ({
  createUrl: vi.fn(),
  deleteUrl: vi.fn(),
  getUrls: vi.fn(),
}));

const existingLink = {
  id: 'existing-id',
  shortCode: 'existing',
  shortUrl: 'http://localhost:3000/existing',
  originalUrl: 'https://example.com/existing-article',
  clicks: 3,
  createdAt: '2026-08-18T12:00:00.000Z',
};

describe('App', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    api.getUrls.mockResolvedValue([]);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(cleanup);

  it('shows a loading state before rendering an empty history', async () => {
    let finishLoading;
    api.getUrls.mockReturnValue(new Promise((resolve) => {
      finishLoading = resolve;
    }));

    render(<App />);
    expect(screen.getByText('Loading your links…')).toBeInTheDocument();

    finishLoading([]);
    expect(await screen.findByRole('heading', { name: 'No links yet' })).toBeInTheDocument();
  });

  it('validates missing and malformed URLs before making a request', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: 'No links yet' });

    fireEvent.click(screen.getByRole('button', { name: 'Shorten link' }));
    expect(screen.getByText('Enter a URL to shorten.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Paste your long link'), {
      target: { value: 'example without a scheme' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Shorten link' }));

    expect(screen.getByText('Enter a complete, valid URL.')).toBeInTheDocument();
    expect(api.createUrl).not.toHaveBeenCalled();
  });

  it('creates, displays, and copies a short URL while adding it to history', async () => {
    const created = {
      ...existingLink,
      id: 'new-id',
      shortCode: 'new-code',
      shortUrl: 'http://localhost:3000/new-code',
      originalUrl: 'https://example.com/new-article',
      clicks: 0,
    };
    api.createUrl.mockResolvedValue(created);
    render(<App />);
    await screen.findByRole('heading', { name: 'No links yet' });

    fireEvent.change(screen.getByLabelText('Paste your long link'), {
      target: { value: `  ${created.originalUrl}  ` },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Shorten link' }));

    expect(await screen.findByText('Your short link is ready')).toBeInTheDocument();
    expect(api.createUrl).toHaveBeenCalledWith(created.originalUrl);
    expect(screen.getByText('1 link')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(created.shortUrl));
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('loads existing history and removes a deleted link', async () => {
    api.getUrls.mockResolvedValue([existingLink]);
    api.deleteUrl.mockResolvedValue(null);
    render(<App />);

    expect(await screen.findByText(existingLink.originalUrl)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: `Delete ${existingLink.shortUrl}` }));

    await waitFor(() => expect(api.deleteUrl).toHaveBeenCalledWith(existingLink.shortCode));
    expect(await screen.findByRole('heading', { name: 'No links yet' })).toBeInTheDocument();
  });

  it('announces a request failure and lets the user dismiss it', async () => {
    api.getUrls.mockRejectedValue(new Error('Could not load links.'));
    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Could not load links.');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss error' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
