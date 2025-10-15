import { db } from "../data/database.js";
// Atualizado com os novos campos (nome, vendas_anual, conversao_final, conversao_data)
const CORRETOR_FIELDS = 'id, nome, email, creci, cpf, afiliacao, celular, descricao, avaliacao, vendas_anual, conversao_final, conversao_data, caracteristicas, foto';
const TABLE_NAME = 'corretores';
async function findAllUsers() {
    const result = await db.query(`SELECT ${CORRETOR_FIELDS} FROM ${TABLE_NAME}`);
    return result.rows;
}
const findUserById = async (id) => {
    const result = await db.query(`SELECT ${CORRETOR_FIELDS} FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
};
const updateUserById = async (id, data) => {
    // ... (lógica inalterada, usa os novos campos do model)
    const keys = Object.keys(data).filter(key => key !== 'id');
    const values = Object.values(data);
    if (keys.length === 0)
        return false;
    const setString = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const query = `UPDATE ${TABLE_NAME} SET ${setString} WHERE id = $${keys.length + 1}`;
    const result = await db.query(query, [...values, id]);
    return (result.rowCount ?? 0) > 0;
};
const insertUser = async (newUser) => {
    const { nome, email, CRECI, CPF, ...rest } = newUser;
    if (!nome || !email || !CRECI || !CPF) {
        throw new Error("Missing required fields: nome, email, CRECI, CPF");
    }
    const allKeys = ['nome', 'email', 'creci', 'cpf', ...Object.keys(rest)];
    const allValues = [nome, email, CRECI, CPF, ...Object.values(rest)];
    const columns = allKeys.join(", ");
    const params = allKeys.map((_, idx) => `$${idx + 1}`).join(", ");
    const result = await db.query(`INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${params}) RETURNING id`, allValues);
    return result.rows[0]?.id ?? null;
};
const deleteUserById = async (id) => {
    // ... (lógica inalterada)
    const result = await db.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
};
export { findAllUsers, findUserById, updateUserById, insertUser, deleteUserById };
