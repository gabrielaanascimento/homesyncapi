import { Router } from 'express';
import * as authController from '../controllers/auth-controller.js';

const router = Router();

// A lógica de login/cadastro foi movida para as camadas de Service/Controller
router.post('/login', authController.login);
router.post('/cadastrar', authController.register);

export default router;