import { Request } from "express";
import { type User } from "../../dist/prisma";

export interface Service {
  host: string;
  port: number;
  name: string;
  version: string;
  timestamp?: number;
}

export interface Entity {
  id?: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Repository<T> {
  create(entity: T): Promise<T>;
  findOneById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  findByCriteria(criteria: Record<string, any>): Promise<T[]>;
  updateById(id: string, updates: Partial<T>): Promise<T | undefined>;
  deleteById(id: string): Promise<void>;
}

export interface TokenPayload {
  userId: string; //user id
  type: "refresh" | "access";
  organizationId?: string;
  roles?: string[] | string; // Array of role ids or "*" for group admin
  // personId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
