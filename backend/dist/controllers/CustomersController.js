import CustomersService from '../services/CustomersService.js';
class CustomersController {
    getAll(req, res) {
        try {
            const customers = CustomersService.getAllCustomers();
            res.status(200).json(customers);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message });
        }
    }
    create(req, res) {
        try {
            const newCustomer = CustomersService.createCustomer(req.body);
            res.status(201).json(newCustomer);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ message });
        }
    }
    getById(req, res) {
        try {
            const customer = CustomersService.getCustomerById(req.params.id);
            if (!customer) {
                res.status(404).json({ message: 'Customer not found' });
                return;
            }
            res.status(200).json(customer);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message });
        }
    }
}
// Singleton instance
export default new CustomersController();
//# sourceMappingURL=CustomersController.js.map