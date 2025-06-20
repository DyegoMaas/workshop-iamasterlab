import type { Request, Response } from 'express';
import type { CreateCustomerRequest } from '../types/Customer.js';
declare class CustomersController {
    getAll(req: Request, res: Response): void;
    create(req: Request<{}, {}, CreateCustomerRequest>, res: Response): void;
    getById(req: Request<{
        id: string;
    }>, res: Response): void;
}
declare const _default: CustomersController;
export default _default;
//# sourceMappingURL=CustomersController.d.ts.map