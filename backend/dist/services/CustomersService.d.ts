import type { Customer, CreateCustomerRequest } from '../types/Customer.js';
declare class CustomersService {
    getAllCustomers(): Customer[];
    createCustomer(customerData: CreateCustomerRequest): Customer;
    getCustomerById(id: string): Customer | undefined;
}
declare const _default: CustomersService;
export default _default;
//# sourceMappingURL=CustomersService.d.ts.map