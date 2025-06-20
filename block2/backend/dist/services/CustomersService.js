import CustomersRepository from '../repositories/CustomersRepository.js';
class CustomersService {
    getAllCustomers() {
        // Em um app real, poderia haver lógica de negócio aqui
        return CustomersRepository.getAll();
    }
    createCustomer(customerData) {
        // Validações poderiam ser adicionadas aqui
        if (!customerData.name || !customerData.email) {
            throw new Error('Name and email are required');
        }
        // Validação de email básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
            throw new Error('Invalid email format');
        }
        return CustomersRepository.create(customerData);
    }
    getCustomerById(id) {
        return CustomersRepository.getById(id);
    }
}
// Singleton instance
export default new CustomersService();
//# sourceMappingURL=CustomersService.js.map