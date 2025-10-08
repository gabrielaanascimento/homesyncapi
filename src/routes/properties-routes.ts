import { Router } from 'express';
import { PropertiesController } from '../controllers/properties-controller';
import { authenticateJWT } from '../../middlewares/auth-middlewares';
import { uploadImovelImages } from '../../middlewares/file-upload-middlewares'; // NOVO IMPORT
import { Request, Response, NextFunction } from 'express'; // NOVO
import multer from 'multer'; // NOVO: Para tratamento de erros específicos do Multer

const router = Router();

// Função Wrapper para tratar erros do Multer (limites de arquivo, campos errados, etc.)
const handleMulterError = (req: Request, res: Response, next: NextFunction) => {
    uploadImovelImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erros específicos do Multer (e.g., FILE_TOO_LARGE, LIMIT_UNEXPECTED_FILE)
            console.error("Multer Error:", err.code, err.message);
            // Retorna 400 ou outro código apropriado para erros de formato/limite
            return res.status(400).json({ 
                success: false, 
                message: `Erro de Upload: ${err.message}`, 
                code: err.code 
            });
        } else if (err) {
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


router.get('/imoveis/', PropertiesController.listAll);
router.get('/imoveis/:id', PropertiesController.getById);

// ROTA MODIFICADA: Usa handleMulterError para tratamento robusto
router.post('/imoveis/:id/upload-images', handleMulterError, PropertiesController.uploadImovelImages);

router.post('/imoveis/', PropertiesController.create);
router.put('/imoveis/:id', PropertiesController.update);
router.delete('/imoveis/:id', PropertiesController.remove);

export default router;