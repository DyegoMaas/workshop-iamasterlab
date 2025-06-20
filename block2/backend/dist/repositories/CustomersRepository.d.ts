import type { Customer, CreateCustomerRequest } from '../types/Customer.js';
declare class CustomersRepository {
    getAll(): Customer[];
    getById(id: string): Customer | undefined;
    create(customerData: CreateCustomerRequest): Customer;
}
declare const _default: CustomersRepository;
export default _default;
//# sourceMappingURL=CustomersRepository.d.ts.map