export class UrlRepository {
  #urls = new Map();

  create(url) {
    const storedUrl = { ...url };
    this.#urls.set(storedUrl.shortCode, storedUrl);
    return { ...storedUrl };
  }

  findAll() {
    return [...this.#urls.values()]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
      .map((url) => ({ ...url }));
  }

  findByShortCode(shortCode) {
    const url = this.#urls.get(shortCode);
    return url ? { ...url } : null;
  }

  exists(shortCode) {
    return this.#urls.has(shortCode);
  }

  incrementClicks(shortCode) {
    const url = this.#urls.get(shortCode);
    if (!url) {
      return null;
    }

    url.clicks += 1;
    return { ...url };
  }

  delete(shortCode) {
    return this.#urls.delete(shortCode);
  }
}
