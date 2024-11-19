import { APIException } from "@/exceptions";
import { RegistryAddress, Service, ServiceIdentity } from "@/types";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// Type definitions for better type safety
interface RegistrationOptions {
  retries?: number;
  interval?: number;
  initialRetryDelay?: number;
}

interface RetryOptions {
  retries: number;
  retryDelay: number;
}

type LogLevel = "info" | "error" | "warn";
type LoggerFn = (
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) => void;

export class RegistryClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly registryAddress: RegistryAddress;
  private readonly service: Service;
  private heartbeatInterval?: NodeJS.Timeout;
  private isShuttingDown = false;
  private readonly logger: LoggerFn;

  constructor(
    registryAddress: RegistryAddress,
    service: Service,
    logger?: LoggerFn,
    axiosConfig?: Partial<AxiosRequestConfig>
  ) {
    this.validateConstructorParams(registryAddress, service);

    this.registryAddress = registryAddress;
    this.service = service;
    this.logger = logger || this.defaultLogger.bind(this);

    // Create configured axios instance with merged configs
    this.axiosInstance = axios.create({
      baseURL: this.registryAddress.url,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
      ...axiosConfig,
    });
  }

  /**
   * Deregisters the service from the registry
   * @throws {APIException} If deregistration fails
   * @returns Promise<Service>
   */
  async deregisterService(): Promise<Service> {
    try {
      const response = await this.axiosInstance.post<Service>(
        "/de-register",
        this.service
      );
      this.logger("info", "Service deregistered successfully", {
        service: this.service.name,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registers service and maintains heartbeat
   * @param options Configuration options for registration and heartbeat
   * @throws {APIException} If registration fails
   * @returns Promise<void>
   */
  async registerAndSendHeartbeat(
    options: RegistrationOptions = {}
  ): Promise<void> {
    const {
      retries = 3,
      interval = 15000,
      initialRetryDelay = 1000,
    } = this.validateRegistrationOptions(options);

    try {
      await this.attemptRegisterWithRetry({
        retries,
        retryDelay: initialRetryDelay,
      });
      await this.startHeartbeat(interval, {
        retries: 1,
        retryDelay: initialRetryDelay,
      });
      this.setupCleanupHandlers();
    } catch (error) {
      this.logger("error", "Registration failed", { error });
      throw this.handleError(error);
    }
  }

  /**
   * Gracefully stops the service
   * @returns Promise<void>
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    this.logger("info", "Initiating shutdown");

    try {
      await this.stopHeartbeat();
      await this.deregisterService();
    } catch (error) {
      this.logger("error", "Error during shutdown", { error });
      throw this.handleError(error);
    }
  }

  private async startHeartbeat(
    interval: number,
    retryOptions: RetryOptions
  ): Promise<void> {
    if (this.heartbeatInterval || this.isShuttingDown) return;

    this.heartbeatInterval = setInterval(async () => {
      if (this.isShuttingDown) return;

      try {
        await this.registerService();
        this.logger("info", "Heartbeat sent successfully");
      } catch (error) {
        this.logger("error", "Heartbeat failed", { error });
        await this.attemptRegisterWithRetry(retryOptions).catch(() => {});
      }
    }, interval);

    this.heartbeatInterval.unref();
  }

  private async stopHeartbeat(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  private setupCleanupHandlers(): void {
    const signals: NodeJS.Signals[] = [
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "SIGABRT",
    ];

    signals.forEach((signal) => {
      process.removeAllListeners(signal);
      process.on(signal, async () => {
        this.logger("info", `Signal ${signal} received, initiating shutdown`);
        await this.shutdown();
        process.exit(0);
      });
    });

    process.on("uncaughtException", this.handleFatalError.bind(this));
    process.on("unhandledRejection", this.handleFatalError.bind(this));
  }

  private async handleFatalError(error: Error): Promise<void> {
    this.logger("error", "Fatal error occurred", { error });
    await this.shutdown();
    process.exit(1);
  }

  private async attemptRegisterWithRetry(options: RetryOptions): Promise<void> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= options.retries; attempt++) {
      try {
        await this.registerService();
        this.logger("info", "Registration successful");
        return;
      } catch (error) {
        lastError = error as Error;
        this.logger("warn", `Registration attempt ${attempt} failed`, {
          error,
        });

        if (attempt === options.retries) break;

        const delay = options.retryDelay * Math.pow(2, attempt - 1);
        await this.delay(delay);
      }
    }

    throw lastError || new Error("Registration failed after retries");
  }

  private async registerService(): Promise<Service> {
    try {
      const response = await this.axiosInstance.put<Service>(
        "/register",
        this.service
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): APIException {
    if (axios.isAxiosError(error)) {
      return this.handleAxiosError(error as AxiosError);
    }

    return this.handleGenericError(error as Error);
  }

  private handleAxiosError(error: AxiosError): APIException {
    if (error.response?.status === 404) {
      return new APIException(
        404,
        error.response.data as Record<string, unknown>
      );
    }

    return new APIException(error.response?.status ?? 500, {
      detail: error.message,
      code: error.code,
      url: error.config?.url,
    });
  }

  private handleGenericError(error: Error): APIException {
    return new APIException(500, {
      detail: error.message || "Unknown error occurred",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }

  private validateConstructorParams(
    registryAddress: RegistryAddress,
    service: Service
  ): void {
    if (!registryAddress?.url) {
      throw new Error("Registry address URL is required");
    }
    if (!service?.name || !service?.version || !service?.port) {
      throw new Error("Service name, version, and port are required");
    }
  }

  private validateRegistrationOptions(
    options: RegistrationOptions
  ): Required<RegistrationOptions> {
    const { retries = 3, interval = 10000, initialRetryDelay = 1000 } = options;

    if (retries < 0) throw new Error("Retries must be non-negative");
    if (interval < 1000) throw new Error("Interval must be at least 1000ms");
    if (initialRetryDelay < 0)
      throw new Error("Initial retry delay must be non-negative");

    return { retries, interval, initialRetryDelay };
  }

  private defaultLogger(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${message}`, meta);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
