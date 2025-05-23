import logger from "@/services/logger";
import { configuration, serviceId } from "@/utils";
import { handleErrorsMiddleWare } from "@hive/shared-middlewares";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import router from "./routes";



const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    logger.info(
      `[+]${configuration.name}:${configuration.version} enable morgan`
    );
  }
  app.use(cors());

  // Make sure to use these body parsers so Auth.js can receive data from the client
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ------------------End middlewares------------------------

  //------------------- routes --------------------------------

  // Add routes here
  app.use("/", router);

  //-------------------end routes-----------------------------

  //---------------- error handler -----------------------
  app.use(handleErrorsMiddleWare(serviceId));
  app.use((req, res) => {
    res.status(404).json({ detail: "Not Found" });
  });

  const port = configuration.port ?? 0;
  httpServer.listen(port, () => {
    const address: any = httpServer.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;
    logger.info(
      `[+]${configuration.name}:${configuration.version} listening on ${bind}`
    );
  });
};

startServer();
