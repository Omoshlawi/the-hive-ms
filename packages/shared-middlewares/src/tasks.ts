import { createLogger, type ServiceIdentity } from "@hive/core-utils";
import { Request } from "express";

function getRollBackTasks(req: Request): (() => Promise<string>)[] {
  if (!(req as any).rollBackTasks) {
    (req as any).rollBackTasks = [];
  }
  return (req as any).rollBackTasks;
}

export const addRollBackTaskToQueue = async (
  req: Request,
  task: () => Promise<string>
) => {
  const currTasks = getRollBackTasks(req);
  currTasks.push(task);
};

export const executeRollBackTasks = async (
  req: Request,
  serviceId: ServiceIdentity
) => {
  const currTasks = getRollBackTasks(req);
  const results = await Promise.allSettled(currTasks.map((task) => task()));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      createLogger(serviceId).error(
        `Rollback task ${index} failed:${result.reason}`
      );
    } else {
      createLogger(serviceId).info(`${result.value}`);
    }
  });
};
