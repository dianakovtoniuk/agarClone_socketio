// The entry point for all Express stuff. The frontend is served separately, so this is just a health check.
import { app } from './servers';

app.get('/health', (_req, res) => {
  res.send('ok');
});

export default app;
