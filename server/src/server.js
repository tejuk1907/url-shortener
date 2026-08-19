import 'dotenv/config';

const [{ default: app }, { config }] = await Promise.all([
  import('./app.js'),
  import('./config.js'),
]);

app.listen(config.port, () => {
  console.log(`URL shortener API listening on ${config.baseUrl}`);
});
