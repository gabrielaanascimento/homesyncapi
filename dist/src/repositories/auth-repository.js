import { db } from "../data/database.js";
// Tabela 'usuarios' substituída por 'corretores'
const findUserByEmail = async (email) => {
    const result = await db.query("SELECT id, nome, email, senha, creci FROM corretores WHERE email = $1", // Incluindo 'nome'
    [email]);
    return result.rows[0] || null;
};
// Cadastro simples de corretor (incluindo 'nome')
const insertNewUser = async (nome, email, senha, CRECI, CPF) => {
    const result = await db.query(`INSERT INTO corretores (nome, email, senha, creci, cpf)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nome, email, creci;`, [nome, email, senha, CRECI, CPF]);
    return result.rows[0] || null;
};
export { findUserByEmail, insertNewUser };
