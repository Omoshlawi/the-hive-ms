import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { configuration, MEDIA_ROOT } from "@/utils";
import morgan from "morgan";
import cors from "cors";



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
  app.use(express.static(MEDIA_ROOT));

  // Make sure to use these body parsers so Auth.js can receive data from the client
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ------------------End middlewares------------------------

  //------------------- routes --------------------------------

  // Add routes here

  //-------------------end routes-----------------------------

  //---------------- error handler -----------------------
  app.use(handleErrors);
  app.use((req, res) => {
    res.status(404).json({ detail: "Not Found" });
  });

  const port = configuration.port ?? 0;
  httpServer.listen(port, () => {
    logger.info("App listening in port port: " + port + "....");
  });
};

startServer();
