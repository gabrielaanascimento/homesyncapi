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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController = __importStar(require("../controllers/users-controller"));
const auth_middlewares_1 = require("../../middlewares/auth-middlewares");
const file_upload_middlewares_1 = require("../../middlewares/file-upload-middlewares"); // NOVO IMPORT
const router = (0, express_1.Router)();
router.get('/corretores/', UsersController.getUser);
router.get('/corretores/:id', UsersController.getUserById);
// NOVA ROTA: Upload de Foto de Perfil
router.post('/corretores/upload-photo', auth_middlewares_1.authenticateJWT, file_upload_middlewares_1.uploadCorretorPhoto, UsersController.uploadCorretorPhoto);
// P6 FIX: Rota POST para Criação (postUser)
router.post('/corretores/', auth_middlewares_1.authenticateJWT, UsersController.postUser);
// P6 FIX: Rota PUT para Atualização (updateUser)
router.put('/corretores/:id', auth_middlewares_1.authenticateJWT, UsersController.updateUser);
router.delete('/corretores/:id', auth_middlewares_1.authenticateJWT, UsersController.deleteUser);
exports.default = router;
