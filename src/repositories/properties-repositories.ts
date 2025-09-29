import { PropertyModel } from "../models/properties-models";
import { db } from "../data/database";

// Tabela 'properties' substituída por 'sistema_imoveis'
const PROPERTY_FIELDS = 'id, corretor_id, cliente_vendedor_id, tipo_imovel, status, endereco, area_construida, andar, preco, descricao';
const TABLE_NAME = 'sistema_imoveis';

const findAllProperties = async (queryLimit: number, queryOffset: number): Promise<PropertyModel[]> => {
    const result = await db.query(`SELECT ${PROPERTY_FIELDS} FROM ${TABLE_NAME} LIMIT $1 OFFSET $2`, [queryLimit, queryOffset]);
    return result.rows as PropertyModel[];
}

const findPropertyById = async (id: number): Promise<PropertyModel | null> => {
    const result = await db.query(`SELECT ${PROPERTY_FIELDS} FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
}

const updatePropertyById = async (id: number, propertyData: Partial<PropertyModel>): Promise<PropertyModel | null> => {
    const keys = Object.keys(propertyData).filter(key => key !== 'id');
    const values = Object.values(propertyData);

    if (keys.length === 0) return null;

    const setString = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    await db.query(`UPDATE ${TABLE_NAME} SET ${setString} WHERE id = $${keys.length + 1}`, [...values, id]);

    const result = await db.query(`SELECT ${PROPERTY_FIELDS} FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
}

const insertProperty = async (newProperty: Omit<PropertyModel, "id">): Promise<number | null> => {
    const keys = Object.keys(newProperty);
    const values = Object.values(newProperty);

    const columns = keys.join(", ");
    const params = keys.map((_, idx) => `$${idx + 1}`).join(", ");

    const result = await db.query(
        `INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${params}) RETURNING id`,
        values
    );
    return result.rows[0]?.id ?? null;
}

const deletePropertyById = async (id: number): Promise<boolean> => {
    const result = await db.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
}

const insertImovelImages = async (imovelId: number, filePaths: string[]): Promise<boolean> => {
    if (filePaths.length === 0) return false;

    // Constrói a query para inserir múltiplas linhas: (imovel_id, caminho)
    // O $1 é o imovelId, e $2, $3, etc., são os filePaths
    const values = filePaths.map((_, index) => `($1, $${index + 2})`).join(', ');
    const query = `
        INSERT INTO imagens_imovel (imovel_id, caminho) 
        VALUES ${values}
        RETURNING id;
    `;
    
    // O array de parâmetros contém o imovelId seguido de todos os caminhos dos arquivos
    const result = await db.query(query, [imovelId, ...filePaths]);
    
    return (result.rowCount ?? 0) > 0;
}

export {
    findAllProperties,
    findPropertyById,
    updatePropertyById,
    insertProperty,
    deletePropertyById,
    insertImovelImages, // EXPORT NEW FUNCTION
}