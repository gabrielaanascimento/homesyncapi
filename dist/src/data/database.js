"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new pg_1.Pool({
    connectionString: "postgresql://neondb_owner:npg_qFZLTlM0RrA5@ep-flat-shape-acgcjh21-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});
