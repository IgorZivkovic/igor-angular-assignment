import 'dotenv/config';
import { waitForPortOpen } from '@nx/node/utils';

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await waitForPortOpen(port, { host });
  await waitForApiHealth(host, port);

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};

async function waitForApiHealth(host: string, port: number) {
  const apiPrefix = process.env.API_PREFIX ?? 'api';
  const apiVersion = process.env.API_VERSION ?? 'v1';
  const healthUrl = `http://${host}:${port}/${apiPrefix}/${apiVersion}/health`;
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // The development server may still be restarting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`API health check did not become ready: ${healthUrl}`);
}
