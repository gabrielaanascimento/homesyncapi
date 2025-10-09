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
exports.PropertiesController = void 0;
const PropertyService = __importStar(require("../services/properties-services"));
const http_help_1 = require("../utils/http-help");
exports.PropertiesController = {
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(req.query.limit) || 20;
            const offset = Number(req.query.offset) || 0;
            const rows = yield PropertyService.getPropertiesService(limit, offset);
            return res.json(rows);
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const imovel = yield PropertyService.getPropertyByIdService(id);
            if (!imovel)
                return res.status(404).json({ message: 'Imóvel não encontrado' });
            return res.json(imovel);
        });
    },
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const created = yield PropertyService.createPropertyService(data);
            return res.status(201).json(created);
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const data = req.body;
            const updated = yield PropertyService.updatePropertyService(id, data);
            if (!updated)
                return res.status(404).json({ message: 'Imóvel não encontrado' });
            return res.json(updated);
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            yield PropertyService.deletePropertyService(id);
            return res.status(204).send();
        });
    },
    uploadImovelImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imovelId = Number(req.params.id);
            const files = req.files; // Multer define req.files como um array para .array()
            console.log(`[DEBUG UPLOAD] Imóvel ID (Sistema): ${imovelId}`);
            // Loga os arquivos recebidos. Se for [], o cliente não enviou ou o Multer falhou.
            console.log(`[DEBUG UPLOAD] Arquivos recebidos:`, files);
            if (!imovelId) {
                return res.status(400).json({ success: false, message: 'O ID do imóvel é obrigatório.' });
            }
            if (!files || files.length === 0) {
                // CORREÇÃO DE FLUXO: Se o Multer falhou sem um MulterError (ou se o cliente enviou 0 arquivos), 
                // a rota continua, e o controller deve retornar 400.
                console.error('[DEBUG UPLOAD] Erro: Nenhuma imagem recebida no controller (files.length é 0).');
                return res.status(400).json({ success: false, message: 'Nenhuma imagem foi enviada.' });
            }
            // Obtém array dos caminhos dos arquivos salvos
            const filePaths = files.map(file => file.path);
            try {
                const httpResponse = yield PropertyService.insertImovelImagesService(imovelId, filePaths);
                return res.status(httpResponse.statusCode).json(httpResponse.body);
            }
            catch (error) {
                console.error('Erro ao fazer upload de imagens:', error);
                const internalError = yield (0, http_help_1.internalServerError)('Erro interno do servidor ao salvar imagens.');
                return res.status(internalError.statusCode).json(internalError.body);
            }
        });
    }
};
