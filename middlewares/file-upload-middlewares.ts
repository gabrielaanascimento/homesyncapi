// middlewares/file-upload-middlewares.ts

import multer from 'multer';
import { Request } from 'express';
import { AuthRequest } from './auth-middlewares.js';

// --- Armazenamento em Memória ---
// Alterado de diskStorage para memoryStorage.
// Isso é mais eficiente e ideal para ambientes serverless como a Vercel,
// pois não salvamos o arquivo fisicamente no servidor antes de enviá-lo para o Cloudinary.
const storage = multer.memoryStorage();

// --- Validação de Tipo de Arquivo (Opcional, mas recomendado) ---
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.'));
    }
};

// --- Definições do Middleware ---

// 1. Upload de Foto de Corretor (Arquivo único)
const uploadCorretorPhoto = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('photo'); // 'photo' é o nome do campo esperado no formulário

// 2. Upload de Imagens de Imóvel (Múltiplos arquivos)
const uploadImovelImages = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB total
}).array('images', 10); // 'images' é o nome do campo, máximo 10 arquivos

export {
    uploadCorretorPhoto,
    uploadImovelImages,
};