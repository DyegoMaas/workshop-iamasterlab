import { Router } from 'express';
import CustomersController from '../controllers/CustomersController.js';

const router = Router();

router.get('/', CustomersController.getAll);
router.post('/', CustomersController.create);
// Outras rotas (GET by ID, PUT, DELETE) seriam adicionadas aqui

export default router;