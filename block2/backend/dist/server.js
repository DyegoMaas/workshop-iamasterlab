import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customers.routes.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no body
// Rotas da API
app.use('/api/customers', customerRoutes);
// Rota de health check
app.get('/', (req, res) => {
    res.send('Backend is running!');
});
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
export default app; // Export for testing 
//# sourceMappingURL=server.js.map