// src/repositories/properties-repositories.ts

// ... (importações e outras funções permanecem as mesmas)
import { PropertyModel } from "../models/properties-models.js";
import { db } from "../data/database.js";

const ALL_FIELDS = `
    s.id, s.imovel_id, s.corretor_id, s.cliente_vendedor_id, s.status,
    i.nome, i.valor, i.destaques, i.local, i.quartos, i.area, i.tipo_imovel, i.endereco, i.area_construida, i.andar, i.descricao, i.image
`; 
const TABLE_NAME_SISTEMA = 'sistema_imoveis';
const TABLE_NAME_IMOVEIS = 'imoveis';
const findAllProperties = async (queryLimit: number, queryOffset: number): Promise<PropertyModel[]> => {
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [queryLimit, queryOffset]);
    return result.rows as PropertyModel[];
}
const findPropertyById = async (id: number): Promise<PropertyModel | null> => {
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        WHERE s.id = $1 AND s.status = 'Disponível'
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
}
const updatePropertyById = async (id: number, propertyData: Partial<PropertyModel>): Promise<PropertyModel | null> => {
    if (propertyData.status) {
        await db.query(`UPDATE ${TABLE_NAME_SISTEMA} SET status = $1 WHERE id = $2`, [propertyData.status, id]);
    }
    return findPropertyById(id);
}
const insertProperty = async (newProperty: Omit<PropertyModel, "id" | "imovel_id">): Promise<number | null> => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const imoveisKeys = ['nome', 'valor', 'destaques', 'local', 'quartos', 'area', 'tipo_imovel', 'endereco', 'area_construida', 'andar', 'descricao'];
        const imoveisValues = imoveisKeys.map(key => (newProperty as any)[key]);
        const imoveisParams = imoveisKeys.map((_, idx) => `$${idx + 1}`).join(", ");
        const imovelResult = await client.query(
            `INSERT INTO ${TABLE_NAME_IMOVEIS} (${imoveisKeys.join(", ")}) VALUES (${imoveisParams}) RETURNING id`,
            imoveisValues
        );
        const newImovelId = imovelResult.rows[0].id;
        const sistemaKeys = ['imovel_id', 'corretor_id', 'cliente_vendedor_id', 'status'];
        const sistemaValues = [newImovelId, newProperty.corretor_id, newProperty.cliente_vendedor_id, newProperty.status];
        const sistemaParams = sistemaKeys.map((_, idx) => `$${idx + 1}`).join(", ");
        const sistemaResult = await client.query(
            `INSERT INTO ${TABLE_NAME_SISTEMA} (${sistemaKeys.join(", ")}) VALUES (${sistemaParams}) RETURNING id`,
            sistemaValues
        );
        const newSistemaId = sistemaResult.rows[0].id;
        await client.query('COMMIT');
        return newSistemaId;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transação de inserção de imóvel falhou:", error);
        throw error;
    } finally {
        client.release();
    }
}
const deletePropertyById = async (id: number): Promise<boolean> => {
    const result = await db.query(`DELETE FROM ${TABLE_NAME_SISTEMA} WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
}

// FUNÇÃO MODIFICADA (apenas o nome do parâmetro)
const insertImovelImages = async (imovelId: number, imageUrls: string[]): Promise<boolean> => {
    const client = await db.connect();
    if (imageUrls.length === 0) {
        client.release();
        return false;
    }

    try {
        await client.query('BEGIN');
        const firstImageUrl = imageUrls[0]; // Pega a primeira imagem para o campo principal
        
        // 1. Inserir todos os caminhos na tabela de imagens (imagens_imovel)
        const values = imageUrls.map((_, index) => `($1, $${index + 2})`).join(', ');
        const queryInsert = `
            INSERT INTO imagens_imovel (imovel_id, caminho) 
            VALUES ${values}
            RETURNING id;
        `;
        const resultInsert = await client.query(queryInsert, [imovelId, ...imageUrls]);
        
        // 2. ATUALIZA A COLUNA 'image' na tabela principal 'imoveis'
        const queryUpdate = `
            UPDATE ${TABLE_NAME_IMOVEIS}
            SET image = $1
            WHERE id = $2;
        `;
        await client.query(queryUpdate, [firstImageUrl, imovelId]); 
        
        await client.query('COMMIT');
        return (resultInsert.rowCount ?? 0) > 0;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transação de inserção de imagens falhou:", error);
        throw error; 
    } finally {
        client.release();
    }
}

export {
    findAllProperties,
    findPropertyById,
    updatePropertyById,
    insertProperty,
    deletePropertyById,
    insertImovelImages, 
}