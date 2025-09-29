import { Router } from 'express';
import * as UsersController from '../controllers/users-controller';
import { authenticateJWT } from '../../middlewares/auth-middlewares';
import { uploadCorretorPhoto } from '../../middlewares/file-upload-middlewares'; // NOVO IMPORT

const router = Router();

router.get('/corretores/', UsersController.getUser);
router.get('/corretores/:id', UsersController.getUserById);

// NOVA ROTA: Upload de Foto de Perfil
router.post('/corretores/upload-photo', authenticateJWT, uploadCorretorPhoto, UsersController.uploadCorretorPhoto);

// P6 FIX: Rota POST para Criação (postUser)
router.post('/corretores/', authenticateJWT, UsersController.postUser);
// P6 FIX: Rota PUT para Atualização (updateUser)
router.put('/corretores/:id', authenticateJWT, UsersController.updateUser);
router.delete('/corretores/:id', authenticateJWT, UsersController.deleteUser);

export default router;