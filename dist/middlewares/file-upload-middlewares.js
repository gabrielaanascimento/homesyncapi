"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImovelImages = exports.uploadCorretorPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// --- Configuração ---
// Define o diretório base (no mesmo nível de 'src')
const UPLOAD_DIR = path_1.default.join(process.cwd(), 'uploads');
const CORRETORES_DIR = path_1.default.join(UPLOAD_DIR, 'corretores');
const IMOVEIS_DIR = path_1.default.join(UPLOAD_DIR, 'imoveis');
// Garante que os diretórios existam
[CORRETORES_DIR, IMOVEIS_DIR].forEach(dir => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// --- Armazenamento para Corretores (Foto Única) ---
const storageCorretores = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CORRETORES_DIR);
    },
    // 2. USO DA INTERFACE AuthRequest PARA TIPAGEM
    filename: (req, file, cb) => {
        var _a;
        // Usa o ID do usuário (se autenticado) ou um sufixo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path_1.default.extname(file.originalname);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // O 'as any' foi removido
        const fileName = `corretor-${userId || uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
    }
});
// --- Armazenamento para Imóveis (Múltiplas Fotos) ---
const storageImoveis = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMOVEIS_DIR);
    },
    filename: (req, file, cb) => {
        // Nomeie o arquivo para garantir a unicidade
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
    }
});
// --- Definições do Middleware ---
// 1. Upload de Foto de Corretor (Arquivo único)
const uploadCorretorPhoto = (0, multer_1.default)({
    storage: storageCorretores,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('photo'); // 'photo' é o nome do campo esperado no formulário
exports.uploadCorretorPhoto = uploadCorretorPhoto;
// 2. Upload de Imagens de Imóvel (Múltiplos arquivos)
const uploadImovelImages = (0, multer_1.default)({
    storage: storageImoveis,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB total
}).array('images', 10); // 'images' é o nome do campo, máximo 10 arquivos
exports.uploadImovelImages = uploadImovelImages;
