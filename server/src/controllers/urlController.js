export function createUrlController(urlService) {
  return {
    create(req, res) {
      const url = urlService.create(req.body?.url);
      res.status(201).json(url);
    },

    list(_req, res) {
      res.json({ urls: urlService.list() });
    },

    remove(req, res) {
      urlService.remove(req.params.shortCode);
      res.sendStatus(204);
    },

    redirect(req, res) {
      res.redirect(302, urlService.resolve(req.params.shortCode));
    },
  };
}
