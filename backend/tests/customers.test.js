import request from 'supertest';
import app from '../src/server.js'; // Importa o app Express

describe('Customers API', () => {
  it('GET /api/customers should return a list of customers', async () => {
    const response = await request(app).get('/api/customers');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name', 'John Doe');
  });
});