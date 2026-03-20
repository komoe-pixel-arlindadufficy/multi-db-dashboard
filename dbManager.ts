import mssql from 'mssql';
import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// MSSQL Configuration
const mssqlConfig: mssql.config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// MySQL Configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// PostgreSQL Configuration
const pgConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export class DBManager {
  private static mssqlPool: mssql.ConnectionPool | null = null;
  private static mysqlPool: mysql.Pool | null = null;
  private static pgPool: Pool | null = null;

  static async getMSSQL() {
    if (!this.mssqlPool) {
      this.mssqlPool = await new mssql.ConnectionPool(mssqlConfig).connect();
    }
    return this.mssqlPool;
  }

  static async getMySQL() {
    if (!this.mysqlPool) {
      this.mysqlPool = mysql.createPool(mysqlConfig);
    }
    return this.mysqlPool;
  }

  static async getPG() {
    if (!this.pgPool) {
      this.pgPool = new Pool(pgConfig);
    }
    return this.pgPool;
  }

  static async checkHealth() {
    const status = {
      mssql: { connected: false, error: null as string | null },
      mysql: { connected: false, error: null as string | null },
      pg: { connected: false, error: null as string | null },
    };

    try {
      const pool = await this.getMSSQL();
      await pool.request().query('SELECT 1');
      status.mssql.connected = true;
    } catch (err: any) {
      status.mssql.error = err.message;
    }

    try {
      const pool = await this.getMySQL();
      await pool.query('SELECT 1');
      status.mysql.connected = true;
    } catch (err: any) {
      status.mysql.error = err.message;
    }

    try {
      const pool = await this.getPG();
      await pool.query('SELECT 1');
      status.pg.connected = true;
    } catch (err: any) {
      status.pg.error = err.message;
    }

    return status;
  }
}
