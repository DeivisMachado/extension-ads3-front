import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './css/nav.css';
import './css/index.css';
import './css/index_criar.css';
import './css/index_clientes.css';
import { Navbar } from './components/Navbar';
import { TabelaAgentes } from './components/TabelaAgentes';
import { FormularioAgente } from './components/FormularioAgente';
import { Login } from './pages/Login';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAgente, setSelectedAgente] = useState(null);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleEdit = (agente) => {
    setSelectedAgente(agente);
    setShowForm(true);
  };

  const handleDelete = async (agente) => {
    // Implementar lógica de deletar
  };

  const handleSave = async (formData) => {
    // Implementar lógica de salvar
    setShowForm(false);
    setSelectedAgente(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar 
          isAdmin={isAdmin} 
          onCadastrar={() => setShowForm(true)} 
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <TabelaAgentes 
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {showForm && (
                  <FormularioAgente 
                    agente={selectedAgente}
                    onSave={handleSave}
                    onClose={() => {
                      setShowForm(false);
                      setSelectedAgente(null);
                    }}
                  />
                )}
              </>
            } 
          />
          
          <Route 
            path="/login" 
            element={<Login onLoginSuccess={() => setIsAdmin(true)} />} 
          />
          
          <Route 
            path="*" 
            element={
              <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h2>Página não encontrada</h2>
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
