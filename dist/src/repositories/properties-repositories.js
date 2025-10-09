"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertImovelImages = exports.deletePropertyById = exports.insertProperty = exports.updatePropertyById = exports.findPropertyById = exports.findAllProperties = void 0;
const database_1 = require("../data/database");
// Tabela 'imoveis' (i) e 'sistema_imoveis' (s)
const ALL_FIELDS = `
    s.id, s.imovel_id, s.corretor_id, s.cliente_vendedor_id, s.status,
    i.nome, i.valor, i.destaques, i.local, i.quartos, i.area, i.tipo_imovel, i.endereco, i.area_construida, i.andar, i.descricao
`;
const TABLE_NAME_SISTEMA = 'sistema_imoveis';
const TABLE_NAME_IMOVEIS = 'imoveis';
const findAllProperties = (queryLimit, queryOffset) => __awaiter(void 0, void 0, void 0, function* () {
    // JOIN obrigatório para obter todos os dados do modelo
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        LIMIT $1 OFFSET $2
    `;
    const result = yield database_1.db.query(query, [queryLimit, queryOffset]);
    return result.rows;
});
exports.findAllProperties = findAllProperties;
const findPropertyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // JOIN obrigatório
    const query = `
        SELECT ${ALL_FIELDS} FROM ${TABLE_NAME_SISTEMA} s
        INNER JOIN ${TABLE_NAME_IMOVEIS} i ON s.imovel_id = i.id
        WHERE s.imovel_id = $1 AND s.status = 'Disponível'
    `;
    const result = yield database_1.db.query(query, [id]);
    return result.rows[0] || null;
});
exports.findPropertyById = findPropertyById;
const updatePropertyById = (id, propertyData) => __awaiter(void 0, void 0, void 0, function* () {
    // Nota: O Multer usa o método updateUserService, não este.
    // Esta função precisaria de lógica complexa para separar os campos de 's' e 'i' e rodar 2 UPDATES.
    // Para manter a API operacional e focar na inserção, este UPDATE será mantido simplificado (apenas 's.status' e FKs).
    // Para atualização de campos descritivos (nome, valor, etc.), seria necessário um novo service/controller.
    // Simplificando o UPDATE para atualizar apenas o status (campo principal de sistema_imoveis)
    if (propertyData.status) {
        yield database_1.db.query(`UPDATE ${TABLE_NAME_SISTEMA} SET status = $1 WHERE id = $2`, [propertyData.status, id]);
    }
    // Retorna o objeto completo após a atualização
    return findPropertyById(id);
});
exports.updatePropertyById = updatePropertyById;
// MUDANÇA CRÍTICA: INSERÇÃO EM DUAS ETAPAS DENTRO DE UMA TRANSAÇÃO
const insertProperty = (newProperty) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield database_1.db.connect();
    try {
        yield client.query('BEGIN');
        // 1. INSERIR NA TABELA 'imoveis' (Catálogo)
        const imoveisKeys = ['nome', 'valor', 'destaques', 'local', 'quartos', 'area', 'tipo_imovel', 'endereco', 'area_construida', 'andar', 'descricao'];
        const imoveisValues = imoveisKeys.map(key => newProperty[key]);
        const imoveisParams = imoveisKeys.map((_, idx) => `$${idx + 1}`).join(", ");
        const imovelResult = yield client.query(`INSERT INTO ${TABLE_NAME_IMOVEIS} (${imoveisKeys.join(", ")}) VALUES (${imoveisParams}) RETURNING id`, imoveisValues);
        const newImovelId = imovelResult.rows[0].id;
        // 2. INSERIR NA TABELA 'sistema_imoveis' (Negociação), usando o ID gerado acima
        const sistemaKeys = ['imovel_id', 'corretor_id', 'cliente_vendedor_id', 'status'];
        const sistemaValues = [newImovelId, newProperty.corretor_id, newProperty.cliente_vendedor_id, newProperty.status];
        const sistemaParams = sistemaKeys.map((_, idx) => `$${idx + 1}`).join(", ");
        const sistemaResult = yield client.query(`INSERT INTO ${TABLE_NAME_SISTEMA} (${sistemaKeys.join(", ")}) VALUES (${sistemaParams}) RETURNING id`, sistemaValues);
        const newSistemaId = sistemaResult.rows[0].id;
        yield client.query('COMMIT');
        return newSistemaId;
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error("Transação de inserção de imóvel falhou:", error);
        throw error; // Propagar o erro para o service
    }
    finally {
        client.release();
    }
});
exports.insertProperty = insertProperty;
const deletePropertyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Para deletar o item, precisamos deletar a negociação em 's' e, opcionalmente, o catálogo em 'i'.
    // Com ON DELETE CASCADE na FK, deletar o item em 'i' deleta em 's'. Deletar 's' não deleta 'i'.
    // A melhor prática é deletar a negociação 's' e manter o catálogo 'i' (a menos que seja especificado o contrário).
    var _a;
    const result = yield database_1.db.query(`DELETE FROM ${TABLE_NAME_SISTEMA} WHERE id = $1`, [id]);
    return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
});
exports.deletePropertyById = deletePropertyById;
const insertImovelImages = (imovelId, filePaths) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (filePaths.length === 0)
        return false;
    // Constrói a query para inserir múltiplas linhas: (imovel_id, caminho)
    // O $1 é o imovelId, e $2, $3, etc., são os filePaths
    const values = filePaths.map((_, index) => `($1, $${index + 2})`).join(', ');
    const query = `
        INSERT INTO imagens_imovel (imovel_id, caminho) 
        VALUES ${values}
        RETURNING id;
    `;
    // O array de parâmetros contém o imovelId seguido de todos os caminhos dos arquivos
    const result = yield database_1.db.query(query, [imovelId, ...filePaths]);
    return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
});
exports.insertImovelImages = insertImovelImages;
