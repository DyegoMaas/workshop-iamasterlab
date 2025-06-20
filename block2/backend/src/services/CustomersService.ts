import CustomersRepository from '../repositories/CustomersRepository.js';
import type { Customer, CreateCustomerRequest } from '../types/Customer.js';

class CustomersService {
  getAllCustomers(): Customer[] {
    // Em um app real, poderia haver lógica de negócio aqui
    return CustomersRepository.getAll();
  }

  createCustomer(customerData: CreateCustomerRequest): Customer {
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

  getCustomerById(id: string): Customer | undefined {
    return CustomersRepository.getById(id);
  }
}

// Singleton instance
export default new CustomersService(); 