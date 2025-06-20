import { Router } from 'express';
import CustomersController from '../controllers/CustomersController.js';
const router = Router();
router.get('/', CustomersController.getAll);
router.get('/:id', CustomersController.getById);
router.post('/', CustomersController.create);
// Outras rotas (PUT, DELETE) seriam adicionadas aqui
export default router;
//# sourceMappingURL=customers.routes.js.map