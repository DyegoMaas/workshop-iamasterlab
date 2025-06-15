import CustomersService from '../services/CustomersService.js';

class CustomersController {
  getAll(req, res) {
    try {
      const customers = CustomersService.getAllCustomers();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  create(req, res) {
    try {
      const newCustomer = CustomersService.createCustomer(req.body);
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

// Singleton instance
export default new CustomersController();