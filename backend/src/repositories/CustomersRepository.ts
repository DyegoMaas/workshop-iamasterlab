import { v4 as uuidv4 } from 'uuid';
import type { Customer, CreateCustomerRequest } from '../types/Customer.js';

// Dados em memória para simular um banco de dados
const customers: Customer[] = [
  { 
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    createdAt: new Date('2024-01-01')
  },
  { 
    id: 'a2f4e6d7-1b3c-4a5e-8d6f-2c7b9a1d0e8f', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    createdAt: new Date('2024-01-02')
  },
];

class CustomersRepository {
  getAll(): Customer[] {
    return customers;
  }

  getById(id: string): Customer | undefined {
    return customers.find(c => c.id === id);
  }

  create(customerData: CreateCustomerRequest): Customer {
    const newCustomer: Customer = { 
      id: uuidv4(), 
      ...customerData,
      createdAt: new Date()
    };
    customers.push(newCustomer);
    return newCustomer;
  }
}

// Singleton instance
export default new CustomersRepository(); 