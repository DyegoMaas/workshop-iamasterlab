import { v4 as uuidv4 } from 'uuid';

// Dados em memória para simular um banco de dados
const customers = [
  { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', name: 'John Doe', email: 'john.doe@example.com', phone: '111-222-333' },
  { id: 'a2f4e6d7-1b3c-4a5e-8d6f-2c7b9a1d0e8f', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '444-555-666' },
];

class CustomersRepository {
  getAll() {
    return customers;
  }

  getById(id) {
    return customers.find(c => c.id === id);
  }

  create(customerData) {
    const newCustomer = { id: uuidv4(), ...customerData };
    customers.push(newCustomer);
    return newCustomer;
  }
}

// Singleton instance
export default new CustomersRepository();