import express, { Application } from "express";
import { createServer, Server } from "http";
import { configuration } from "@/utils";
import morgan from "morgan";
import cors from "cors";
import { handleErrorsMiddleWare } from "@hive/shared-middlewares";
import { RegistryClient } from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "@/utils";
import { toNumber } from "lodash";
import logger from "@/services/logger";
import router from "./routes";

export interface ServerAddress {
  address: string;
  port: number;
}

export default class ApplicationServer {
  private app: Application;
  private httpServer: Server;
  private registryClient?: RegistryClient;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares(): void {
    if (this.app.get("env") === "development") {
      this.app.use(morgan("tiny"));
      logger.info(
        `[+]${configuration.name}:${configuration.version} enable morgan`
      );
    }
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Add routes here
    this.app.use("/", router);

    // Default 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ detail: "Not Found" });
    });
  }

  private setupErrorHandlers(): void {
    this.app.use(handleErrorsMiddleWare(serviceIdentity));
  }

  private getServerAddress(): ServerAddress {
    const address = this.httpServer.address();

    if (!address) {
      throw new Error("Could not determine server address");
    }

    if (typeof address === "string") {
      return {
        address: "localhost",
        port: toNumber(configuration.port ?? 0),
      };
    }

    return {
      address: address.address || "localhost",
      port: address.port,
    };
  }

  private setupRegistryClient(serverAddress: ServerAddress): void {
    // Create registry client with custom logger that uses the application logger
    this.registryClient = new RegistryClient(
      registryAddress,
      {
        ...serviceIdentity,
        host: serverAddress.address,
        port: serverAddress.port,
      },
      (level, message, meta) => {
        switch (level) {
          case "info":
            logger.info(message, meta);
            break;
          case "error":
            logger.error(message, meta);
            break;
          case "warn":
            logger.warn(message, meta);
            break;
        }
      },
      {
        timeout: 5000, // 5 second timeout
        validateStatus: (status) => status >= 200 && status < 300,
      }
    );
  }

  private async registerService(): Promise<void> {
    if (!this.registryClient) {
      throw new Error("Registry client not initialized");
    }
    try {
      await this.registryClient.registerAndSendHeartbeat({
        retries: 5, // Increase retries for initial registration
        interval: 10000, // 15 seconds heartbeat interval
        initialRetryDelay: 1000,
      });
      logger.info(
        `Service ${serviceIdentity.name}:${serviceIdentity.version} registered successfully`
      );
    } catch (error) {
      logger.error("Failed to register service:", error);
      await this.shutdown();
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    try {
      if (this.registryClient) {
        await this.registryClient.shutdown();
      }

      // Close HTTP server gracefully
      await new Promise<void>((resolve, reject) => {
        this.httpServer.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      logger.info("Server shutdown completed");
    } catch (error) {
      logger.error("Error during shutdown:", error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    const port = configuration.port ?? 0;

    return new Promise((resolve, reject) => {
      this.httpServer.listen(port, () => {
        try {
          const serverAddress = this.getServerAddress();
          const bind =
            typeof serverAddress === "string"
              ? `pipe ${serverAddress}`
              : `port ${serverAddress.port}`;

          logger.info(
            `[+]${configuration.name}:${configuration.version} listening on ${bind}`
          );

          this.setupRegistryClient(serverAddress);

          // Register service after server is running
          this.registerService().then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      });

      this.httpServer.on("error", (error) => {
        reject(error);
      });
    });
  }
}
