import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AuthRequest } from './auth-middlewares.js'; // 1. NOVO IMPORT

// --- Configuração ---

// Define o diretório base (no mesmo nível de 'src')
const UPLOAD_DIR = path.join(process.cwd(), 'uploads'); 
const CORRETORES_DIR = path.join(UPLOAD_DIR, 'corretores');
const IMOVEIS_DIR = path.join(UPLOAD_DIR, 'imoveis');

// Garante que os diretórios existam
[CORRETORES_DIR, IMOVEIS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// --- Armazenamento para Corretores (Foto Única) ---

const storageCorretores = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CORRETORES_DIR);
    },
    // 2. USO DA INTERFACE AuthRequest PARA TIPAGEM
    filename: (req: AuthRequest, file, cb) => { 
        // Usa o ID do usuário (se autenticado) ou um sufixo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const userId = req.user?.userId; // O 'as any' foi removido
        
        const fileName = `corretor-${userId || uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
    }
});

// --- Armazenamento para Imóveis (Múltiplas Fotos) ---

const storageImoveis = multer.diskStorage({
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
const uploadCorretorPhoto = multer({
    storage: storageCorretores,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('photo'); // 'photo' é o nome do campo esperado no formulário

// 2. Upload de Imagens de Imóvel (Múltiplos arquivos)
const uploadImovelImages = multer({
    storage: storageImoveis,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB total
}).array('images', 10); // 'images' é o nome do campo, máximo 10 arquivos

export {
    uploadCorretorPhoto,
    uploadImovelImages,
};