import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomersPage />} />
        {/* A regra do Cursor adicionará a rota para /suppliers aqui */}
      </Routes>
    </Layout>
  );
}

export default App;