import request from 'supertest';
import app from '../src/server.js';

describe('Customers API', () => {
  it('GET /api/customers should return a list of customers', async () => {
    const response = await request(app).get('/api/customers');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name', 'John Doe');
    expect(response.body[0]).toHaveProperty('email', 'john.doe@example.com');
    expect(response.body[0]).toHaveProperty('createdAt');
  });

  it('POST /api/customers should create a new customer', async () => {
    const newCustomer = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/customers')
      .send(newCustomer);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', newCustomer.name);
    expect(response.body).toHaveProperty('email', newCustomer.email);
    expect(response.body).toHaveProperty('createdAt');
  });

  it('POST /api/customers should return 400 for invalid email', async () => {
    const invalidCustomer = {
      name: 'Test User',
      email: 'invalid-email'
    };

    const response = await request(app)
      .post('/api/customers')
      .send(invalidCustomer);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid email format');
  });

  it('GET /api/customers/:id should return a specific customer', async () => {
    const response = await request(app).get('/api/customers/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed');
    expect(response.body).toHaveProperty('name', 'John Doe');
  });

  it('GET /api/customers/:id should return 404 for non-existent customer', async () => {
    const response = await request(app).get('/api/customers/non-existent-id');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Customer not found');
  });
}); 