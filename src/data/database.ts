// src/data/database.ts

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qFZLTlM0RrA5@ep-flat-shape-acgcjh21-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
  // Removi 'channel_binding=require' que pode causar problemas em alguns ambientes.
  // É melhor gerenciar a connection string via variável de ambiente (.env).
});

// ** ADICIONADO: Listener para erros no pool **
// Isso irá capturar erros de conexão que ocorrem a qualquer momento.
db.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool de banco de dados', err);
  process.exit(-1); // Encerra o processo para evitar comportamento imprevisível
});

// ** ADICIONADO: Função para testar a conexão **
// Isso garante que a aplicação só continue se o banco estiver acessível.
export const testConnection = async () => {
  try {
    const client = await db.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    client.release(); // Libera o cliente de volta para o pool
  } catch (err) {
    console.error('Não foi possível conectar ao banco de dados:', err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
};