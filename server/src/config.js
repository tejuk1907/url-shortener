const port = Number.parseInt(process.env.PORT ?? '3000', 10);

export const config = {
  port: Number.isNaN(port) ? 3000 : port,
  baseUrl: (process.env.BASE_URL ?? `http://localhost:${Number.isNaN(port) ? 3000 : port}`)
    .replace(/\/$/, ''),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};
