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
    return CustomersRepository.create(customerData);
  }
}

// Singleton instance
export default new CustomersService();