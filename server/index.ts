import "dotenv/config";
import { createServer } from "node:http";
import { createApplication } from "./src/server";
import { initSocket } from "./src/common/sockets";

async function main() {
  try {
    const app = createApplication();
    const httpServer = createServer(app);

    // Socket.io
    initSocket(httpServer);

    const PORT: number = Number(process.env.PORT) || 3000;

    httpServer.listen(PORT, () => {
      console.log(
        `server listening on http://localhost:${PORT} (${process.env.NODE_ENV})`,
      );
    });

    // shutdown so DB connections aren't left hanging.
    const shutdown = (signal: string) => {
      // eslint-disable-next-line no-console
      console.log(`[pulse-board] received ${signal}, shutting down`);
      httpServer.close(() => process.exit(0));
      // Force-exit after 10s if shutdown hangs.
      setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[pulse-board] failed to start", error);
    process.exit(1);
  }
}

main();
