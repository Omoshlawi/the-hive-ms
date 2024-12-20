import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { filesRouterMiddleware } from "@/controllers/files";
import { serviceRouterMiddleware } from "@/utils";
import { GatewayProxyRoute } from "@/types";
import mediaAddRouter from "./files";
import registryRouter from "./registry";
import logger from "@/services/logger"; // Assume a centralized logging utility

class ProxyRouteLoader {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeStaticRoutes();
  }

  private initializeStaticRoutes() {
    this.router.use("/media/upload", mediaAddRouter);
    this.router.use("/media", filesRouterMiddleware);
    this.router.use("/service-registry", registryRouter);
  }

  async loadDynamicRoutes() {
    try {
      const proxyRoutesDir = path.join(process.cwd(), "src", "proxy-routes");
      const serviceRouteFiles = await this.getValidRouteFiles(proxyRoutesDir);

      for (const file of serviceRouteFiles) {
        await this.processRouteFile(proxyRoutesDir, file);
      }
    } catch (error) {
      logger.error("Error loading proxy routes", { error });
    }

    return this.router;
  }

  private async getValidRouteFiles(directory: string): Promise<string[]> {
    try {
      const files = await fs.readdir(directory);
      return files.filter(
        (file) => file.endsWith("proxy.ts") || file.endsWith("proxy.js")
      );
    } catch (error) {
      logger.warn("Unable to read proxy routes directory", {
        directory,
        error,
      });
      return [];
    }
  }

  private async processRouteFile(directory: string, file: string) {
    try {
      const filePath = path.join(directory, file);
      const importedModule = await import(filePath);
      const routes: Array<GatewayProxyRoute> = importedModule.default;

      routes.forEach((route) => this.registerRoute(route, file));
    } catch (error) {
      logger.error(`Error processing route file: ${file}`, { error });
    }
  }

  private registerRoute(route: GatewayProxyRoute, fileName: string) {
    if (!this.isValidRoute(route)) {
      logger.warn(`Invalid route definition in file: ${fileName}`, { route });
      return;
    }

    this.router.use(
      route.path,
      serviceRouterMiddleware(
        route.serviceName,
        route.prefix || "",
        route.serviceVersion,
        route.includeHeaders,
        5000
      )
    );
  }

  private isValidRoute(route: GatewayProxyRoute): boolean {
    return !!(route.path && route.serviceName);
  }

  getRouter(): Router {
    return this.router;
  }
}

// Singleton-like approach for route loading
const proxyRouteLoader = new ProxyRouteLoader();

// Asynchronous route initialization
const initializeRoutes = async () => {
  await proxyRouteLoader.loadDynamicRoutes();
};

// Start route initialization immediately
initializeRoutes().catch((error) => {
  logger.error("Failed to initialize proxy routes", { error });
});

export default proxyRouteLoader.getRouter();
