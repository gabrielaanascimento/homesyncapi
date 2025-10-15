import { db } from "../data/database.js";
import { AuthCorretorModel } from "../models/users-models.js";

// Tabela 'usuarios' substituída por 'corretores'
const findUserByEmail = async (email: string): Promise<AuthCorretorModel | null> => {
    const result = await db.query(
        "SELECT id, nome, email, senha, creci FROM corretores WHERE email = $1", // Incluindo 'nome'
        [email]
    );
    return result.rows[0] || null;
};

// Cadastro simples de corretor (incluindo 'nome')
const insertNewUser = async (nome: string, email: string, senha: string, CRECI: string, CPF: string, telefone: string): Promise<AuthCorretorModel | null> => {
    const result = await db.query(
        `INSERT INTO corretores (nome, email, senha, creci, cpf, celular)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, nome, email, creci, celular;`,
        [nome, email, senha, CRECI, CPF, telefone]
    );
    return result.rows[0] || null;
};

export {
    findUserByEmail,
    insertNewUser
}