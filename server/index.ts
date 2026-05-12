import { createServer } from "node:http";
import { createApplication } from "./src/server";

async function main() {
  try {
    const app = createApplication();

    const server = createServer(app);

    const PORT: number = Number(process.env.PORT) || 3000;

    server.listen(PORT, () => {
      console.log(
        `Server is running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`,
      );
    });
  } catch (error) {
    console.log("Error starting http server", error);
    process.exit(1);
  }
}

main();
