import { Router } from 'express';
import { PropertiesController } from '../controllers/properties-controller';
import { authenticateJWT } from '../../middlewares/auth-middlewares';
import { uploadImovelImages } from '../../middlewares/file-upload-middlewares'; // NOVO IMPORT

const router = Router();

router.get('/imoveis/', PropertiesController.listAll);
router.get('/imoveis/:id', PropertiesController.getById);

// NOVA ROTA: POST /imoveis/:id/upload-images
router.post('/imoveis/:id/upload-images', authenticateJWT, uploadImovelImages, PropertiesController.uploadImovelImages);

router.post('/imoveis/', authenticateJWT, PropertiesController.create);
router.put('/imoveis/:id', authenticateJWT, PropertiesController.update);
router.delete('/imoveis/:id', authenticateJWT, PropertiesController.remove);

export default router;