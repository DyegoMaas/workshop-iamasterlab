import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Workshop</h2>
        <ul className="sidebar-menu">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/customers">Customers</NavLink></li>
          {/* A regra do Cursor adicionará o link para Suppliers aqui */}
        </ul>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;