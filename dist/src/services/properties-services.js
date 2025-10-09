"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.insertImovelImagesService = exports.updatePropertyService = exports.deletePropertyService = exports.createPropertyService = exports.getPropertiesService = exports.getPropertyByIdService = void 0;
const httpResponse = __importStar(require("../utils/http-help"));
const propertiesRepository = __importStar(require("../repositories/properties-repositories"));
const getPropertiesService = (queryLimit, queryOffset) => __awaiter(void 0, void 0, void 0, function* () {
    const dataProperties = yield propertiesRepository.findAllProperties(queryLimit, queryOffset);
    let response;
    if (dataProperties && dataProperties.length > 0) {
        response = yield httpResponse.ok(dataProperties);
    }
    else {
        response = yield httpResponse.noContent();
    }
    return response;
});
exports.getPropertiesService = getPropertiesService;
const getPropertyByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const dataProperty = yield propertiesRepository.findPropertyById(id);
    let response;
    if (dataProperty) {
        response = yield httpResponse.ok(dataProperty);
    }
    else {
        response = yield httpResponse.noContent();
    }
    return response;
});
exports.getPropertyByIdService = getPropertyByIdService;
// P8 FIX: Altera a assinatura para Omit<PropertyModel, "id"> e lida com o novo retorno (ID)
const createPropertyService = (property) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    if (Object.keys(property).length != 0) {
        try {
            const newSistemaId = yield propertiesRepository.insertProperty(property);
            if (newSistemaId) {
                response = yield httpResponse.created({ id: newSistemaId, message: "Property created successfully" });
            }
            else {
                response = yield httpResponse.badRequest({ message: "Failed to insert property" });
            }
        }
        catch (error) {
            console.error("Erro no serviço de criação:", error);
            response = yield httpResponse.internalServerError({ message: "Erro interno do servidor ao criar a propriedade." });
        }
    }
    else {
        response = yield httpResponse.badRequest();
    }
    return response;
});
exports.createPropertyService = createPropertyService;
const deletePropertyService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    const isDeleted = yield propertiesRepository.deletePropertyById(id);
    if (isDeleted) {
        response = yield httpResponse.ok({ message: "deleted" });
    }
    else {
        response = yield httpResponse.badRequest();
    }
    return response;
});
exports.deletePropertyService = deletePropertyService;
const updatePropertyService = (id, propertyData) => __awaiter(void 0, void 0, void 0, function* () {
    let responseUpdate;
    try {
        const updatedProperty = yield propertiesRepository.updatePropertyById(id, propertyData);
        if (updatedProperty && typeof updatedProperty === "object" && Object.keys(updatedProperty).length !== 0) {
            responseUpdate = yield httpResponse.ok(updatedProperty);
            return responseUpdate;
        }
        else {
            responseUpdate = yield httpResponse.badRequest();
            return responseUpdate;
        }
    }
    catch (err) {
        responseUpdate = yield httpResponse.badRequest();
        return responseUpdate;
    }
});
exports.updatePropertyService = updatePropertyService;
// CORREÇÃO: Usa o ID do sistema (URL) para buscar o ID do catálogo (imovel_id)
const insertImovelImagesService = (sistemaImovelId, filePaths) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Usa o ID do sistema (sistema_imoveis.id) para buscar a propriedade completa
        const propertyResponse = yield getPropertyByIdService(sistemaImovelId);
        if (propertyResponse.statusCode !== 200 || !propertyResponse.body) {
            console.error(`[DEBUG UPLOAD SERVICE] Falha ao buscar propriedade ${sistemaImovelId}. Status: ${propertyResponse.statusCode}`);
            return httpResponse.badRequest({ success: false, message: 'Imóvel não encontrado no sistema.' });
        }
        // 2. Extrai o ID do catálogo (`imovel_id`)
        const property = propertyResponse.body;
        // NOVO DEBUG: Loga o objeto retornado para confirmar a presença do imovel_id
        console.log(`[DEBUG UPLOAD SERVICE] Objeto Property retornado para ID ${sistemaImovelId}:`, property);
        const imovelId = property.imovel_id; // <-- ID CORRETO (imoveis.id)
        console.log(`[DEBUG UPLOAD SERVICE] ID do Sistema: ${sistemaImovelId} -> ID do Catálogo (imoveis.id) extraído: ${imovelId}`);
        if (!imovelId) {
            console.error('[DEBUG UPLOAD SERVICE] imovel_id está ausente no objeto retornado.');
            // Se imovel_id é null/undefined, significa que o JOIN no repositório falhou ou não existe.
            return httpResponse.badRequest({ success: false, message: 'ID do catálogo de imóvel ausente. (Verifique o JOIN no Repositório)' });
        }
        // 3. Passa o ID do catálogo para o repositório para inserção em imagens_imovel
        const isSuccess = yield propertiesRepository.insertImovelImages(imovelId, filePaths);
        if (isSuccess) {
            console.log(`[DEBUG UPLOAD SERVICE] Sucesso na inserção de ${filePaths.length} caminhos de imagem para imovel_id: ${imovelId}`);
            return httpResponse.created({
                success: true,
                message: `Imagens salvas com sucesso para o imóvel ID ${imovelId}.`,
                filePaths: filePaths
            });
        }
        else {
            // Se rowCount=0, a query não inseriu dados, indicando um erro de integridade de dados (e.g. FK)
            // que não foi lançado como exceção pelo driver.
            console.error(`[DEBUG UPLOAD SERVICE] Repositório retornou falha na inserção (rowCount=0) para imovel_id: ${imovelId}. Verifique a query SQL.`);
            return httpResponse.badRequest({ success: false, message: 'Falha ao salvar imagens no banco de dados. (Verifique a validade do ID no Catálogo)' });
        }
    }
    catch (error) {
        // Este catch captura erros de banco de dados (como o 23503)
        console.error('Erro **CRÍTICO** no serviço ao inserir imagens (Provavelmente DB):', error);
        return httpResponse.internalServerError({ success: false, message: 'Erro interno do servidor ao salvar imagens. Verifique a conexão ou a integridade do DB.' });
    }
});
exports.insertImovelImagesService = insertImovelImagesService;
