import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_qFZLTlM0RrA5@ep-flat-shape-acgcjh21-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});