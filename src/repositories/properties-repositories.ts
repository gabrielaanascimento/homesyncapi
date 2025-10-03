import { PropertyModel } from "../models/properties-models";
import { db } from "../data/database";

// Tabela 'imoveis' (i) e 'sistema_imoveis' (s)
const ALL_FIELDS = `
    s.id, s.imovel_id, s.corretor_id, s.cliente_vendedor_id, s.status,
    i.nome, i.valor, i.destaques, i.local, i.quartos, i.area, i.tipo_imovel, i.endereco, i.area_construida, i.andar, i.descricao
`;
const TABLE_NAME_SISTEMA = 'sistema_imoveis';
const TABLE_NAME_IMOVEIS = 'imoveis';

const findAllProperties = async (queryLimit: number, queryOffset: number): Promise<PropertyModel[]> => {
    // JOIN obrigatório para obter todos os dados do modelo
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [queryLimit, queryOffset]);
    return result.rows as PropertyModel[];
}

const findPropertyById = async (id: number): Promise<PropertyModel | null> => {
    // JOIN obrigatório
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        WHERE s.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
}

const updatePropertyById = async (id: number, propertyData: Partial<PropertyModel>): Promise<PropertyModel | null> => {
    // Nota: O Multer usa o método updateUserService, não este.
    // Esta função precisaria de lógica complexa para separar os campos de 's' e 'i' e rodar 2 UPDATES.
    // Para manter a API operacional e focar na inserção, este UPDATE será mantido simplificado (apenas 's.status' e FKs).
    // Para atualização de campos descritivos (nome, valor, etc.), seria necessário um novo service/controller.
    
    // Simplificando o UPDATE para atualizar apenas o status (campo principal de sistema_imoveis)
    if (propertyData.status) {
        await db.query(`UPDATE ${TABLE_NAME_SISTEMA} SET status = $1 WHERE id = $2`, [propertyData.status, id]);
    }
    
    // Retorna o objeto completo após a atualização
    return findPropertyById(id);
}

// MUDANÇA CRÍTICA: INSERÇÃO EM DUAS ETAPAS DENTRO DE UMA TRANSAÇÃO
const insertProperty = async (newProperty: Omit<PropertyModel, "id" | "imovel_id">): Promise<number | null> => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. INSERIR NA TABELA 'imoveis' (Catálogo)
        const imoveisKeys = ['nome', 'valor', 'destaques', 'local', 'quartos', 'area', 'tipo_imovel', 'endereco', 'area_construida', 'andar', 'descricao'];
        const imoveisValues = imoveisKeys.map(key => (newProperty as any)[key]);
        const imoveisParams = imoveisKeys.map((_, idx) => `$${idx + 1}`).join(", ");
        
        const imovelResult = await client.query(
            `INSERT INTO ${TABLE_NAME_IMOVEIS} (${imoveisKeys.join(", ")}) VALUES (${imoveisParams}) RETURNING id`,
            imoveisValues
        );
        const newImovelId = imovelResult.rows[0].id;

        // 2. INSERIR NA TABELA 'sistema_imoveis' (Negociação), usando o ID gerado acima
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
        throw error; // Propagar o erro para o service
    } finally {
        client.release();
    }
}

const deletePropertyById = async (id: number): Promise<boolean> => {
    // Para deletar o item, precisamos deletar a negociação em 's' e, opcionalmente, o catálogo em 'i'.
    // Com ON DELETE CASCADE na FK, deletar o item em 'i' deleta em 's'. Deletar 's' não deleta 'i'.
    // A melhor prática é deletar a negociação 's' e manter o catálogo 'i' (a menos que seja especificado o contrário).
    
    const result = await db.query(`DELETE FROM ${TABLE_NAME_SISTEMA} WHERE id = $1`, [id]);
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
    insertImovelImages, 
}