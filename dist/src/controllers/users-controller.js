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
exports.uploadCorretorPhoto = exports.updateUser = exports.deleteUser = exports.postUser = exports.getUserById = exports.getUser = void 0;
const service = __importStar(require("../services/users-services"));
const http_help_1 = require("../utils/http-help");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada)
    const httpResponse = yield service.getUserService();
    res.status(httpResponse.statusCode).json(httpResponse.body);
});
exports.getUser = getUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada)
    const id = parseInt(req.params.id);
    const httpResponse = yield service.getUserByIdService(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
});
exports.getUserById = getUserById;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyValue = req.body; // CORRIGIDO
    const httpResponse = yield service.createUserService(bodyValue);
    if (httpResponse) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    else {
        const response = yield (0, http_help_1.noContent)();
        res.status(response.statusCode).json(response.body);
    }
});
exports.postUser = postUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada)
    let response = null;
    const id = parseInt(req.params.id);
    const httpResponse = yield service.deleteUserService(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const bodyValue = req.body; // CORRIGIDO
    const httpResponse = yield service.updateUserService(id, bodyValue);
    res.status(httpResponse.statusCode).json(httpResponse.body);
});
exports.updateUser = updateUser;
const uploadCorretorPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ... (lógica inalterada)
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo de foto foi enviado.' });
    }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    // O caminho do arquivo salvo (e.g., uploads/corretores/corretor-123.jpg)
    const photoPath = req.file.path;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }
    try {
        // Usa o serviço existente para atualizar o campo 'foto'
        const updateResult = yield service.updateUserService(userId, { foto: photoPath });
        if (updateResult.statusCode === 200) {
            return res.status(200).json({
                success: true,
                message: 'Foto de perfil salva com sucesso.',
                filePath: photoPath
            });
        }
        else {
            // Lide com o erro aqui, talvez deletando o arquivo salvo
            return res.status(updateResult.statusCode).json(updateResult.body);
        }
    }
    catch (error) {
        console.error('Erro ao salvar foto do corretor:', error);
        return res.status(500).json({ success: false, message: 'Erro interno ao processar a foto.' });
    }
});
exports.uploadCorretorPhoto = uploadCorretorPhoto;
// CORRIGIDO: Exportar todas as funções para o roteador
