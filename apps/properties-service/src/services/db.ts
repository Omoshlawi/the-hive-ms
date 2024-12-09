import {  PrismaClient } from "../../dist/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;


export async function getTableFields(
    prisma: PrismaClient,
    dbType: "postgresql" | "mysql" | "sqlite" = "postgresql"
  ) {
    const tableFields: {
      [key: string]: {
        columnNames: string[];
        orderedColumns: {
          name: string;
          position: number;
          type?: string;
          nullable?: boolean;
        }[];
      };
    } = {};
  
    if (dbType === "postgresql") {
      const schemaResult = await prisma.$queryRawUnsafe<
        { schema_name: string }[]
      >(`SELECT CURRENT_SCHEMA()::text AS schema_name`);
      const schema = schemaResult[0]?.schema_name;
  
      if (!schema) {
        throw new Error("Schema could not be determined for PostgreSQL.");
      }
  
      const columns = await prisma.$queryRawUnsafe<
        {
          table_name: string;
          column_name: string;
          ordinal_position: number;
          data_type: string;
          is_nullable: string;
        }[]
      >(
        `
          SELECT table_name::text, column_name::text, ordinal_position, data_type::text, is_nullable
          FROM information_schema.columns
          WHERE table_schema = $1::text
          ORDER BY table_name, ordinal_position
          `,
        schema
      );
  
      for (const column of columns) {
        if (!tableFields[column.table_name]) {
          tableFields[column.table_name] = {
            columnNames: [],
            orderedColumns: [],
          };
        }
  
        tableFields[column.table_name].columnNames.push(column.column_name);
        tableFields[column.table_name].orderedColumns.push({
          name: column.column_name,
          position: column.ordinal_position,
          type: column.data_type,
          nullable: column.is_nullable === "YES",
        });
      }
    } else if (dbType === "mysql") {
      const columns = await prisma.$queryRawUnsafe<
        {
          table_name: string;
          column_name: string;
          ordinal_position: number;
          data_type: string;
          is_nullable: string;
        }[]
      >(
        `
          SELECT table_name, column_name, ordinal_position, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = DATABASE()
          ORDER BY table_name, ordinal_position
          `
      );
  
      for (const column of columns) {
        if (!tableFields[column.table_name]) {
          tableFields[column.table_name] = {
            columnNames: [],
            orderedColumns: [],
          };
        }
  
        tableFields[column.table_name].columnNames.push(column.column_name);
        tableFields[column.table_name].orderedColumns.push({
          name: column.column_name,
          position: column.ordinal_position,
          type: column.data_type,
          nullable: column.is_nullable === "YES",
        });
      }
    } else if (dbType === "sqlite") {
      const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
      );
  
      for (const table of tables) {
        const columns = await prisma.$queryRawUnsafe<
          {
            name: string;
            type: string;
            notnull: number;
            cid: number;
          }[]
        >(`PRAGMA table_info(${table.name});`);
  
        tableFields[table.name] = {
          columnNames: columns.map((col) => col.name),
          orderedColumns: columns.map((col) => ({
            name: col.name,
            position: col.cid,
            type: col.type,
            nullable: col.notnull === 0,
          })),
        };
      }
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  
    return tableFields;
  }