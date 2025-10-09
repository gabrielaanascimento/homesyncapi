"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const properties_controller_1 = require("../controllers/properties-controller");
const file_upload_middlewares_1 = require("../../middlewares/file-upload-middlewares"); // NOVO IMPORT
const multer_1 = __importDefault(require("multer")); // NOVO: Para tratamento de erros específicos do Multer
const router = (0, express_1.Router)();
// Função Wrapper para tratar erros do Multer (limites de arquivo, campos errados, etc.)
const handleMulterError = (req, res, next) => {
    (0, file_upload_middlewares_1.uploadImovelImages)(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // Erros específicos do Multer (e.g., FILE_TOO_LARGE, LIMIT_UNEXPECTED_FILE)
            console.error("Multer Error:", err.code, err.message);
            // Retorna 400 ou outro código apropriado para erros de formato/limite
            return res.status(400).json({
                success: false,
                message: `Erro de Upload: ${err.message}`,
                code: err.code
            });
        }
        else if (err) {
            // Outros erros (e.g., erro de disco, erro de destino)
            console.error("Erro Desconhecido de Upload:", err);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor ao processar o upload.'
            });
        }
        next(); // Continua se o Multer processou a requisição sem erros.
    });
};
router.get('/imoveis/', properties_controller_1.PropertiesController.listAll);
router.get('/imoveis/:id', properties_controller_1.PropertiesController.getById);
// ROTA MODIFICADA: Usa handleMulterError para tratamento robusto
router.post('/imoveis/:id/upload-images', handleMulterError, properties_controller_1.PropertiesController.uploadImovelImages);
router.post('/imoveis/', properties_controller_1.PropertiesController.create);
router.put('/imoveis/:id', properties_controller_1.PropertiesController.update);
router.delete('/imoveis/:id', properties_controller_1.PropertiesController.remove);
exports.default = router;
