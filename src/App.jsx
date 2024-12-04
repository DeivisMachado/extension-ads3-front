import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './css/nav.css';
import './styles/global.css';
import { Navbar } from './components/Navbar';
import { TabelaAgentes } from './components/TabelaAgentes';

import { Login } from './pages/Login';
import api from './services/api';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedAgente, setSelectedAgente] = useState(null);

  console.log('Estado atual:', { isAdmin, showForm });

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleEdit = (agente) => {
    console.log('Dados do agente para edição:', agente); // Log para debug
    
    // Formatar os dados do agente para o formato esperado pelo formulário
    const agenteFormatado = {
      ...agente,
      cidade: agente.cidade?.id || '', // Usar o ID da cidade
      id_cidade: agente.cidade?.id || '', // Manter compatibilidade
    };
    
    console.log('Dados formatados para edição:', agenteFormatado); // Log para debug
    setSelectedAgente(agenteFormatado);
    setShowForm(true);
  };

  const handleDelete = async (agente) => {
    try {
      // Confirmação antes de deletar
      const confirma = window.confirm(
        `Tem certeza que deseja excluir o agente "${agente.nome}"?`
      );
      
      if (!confirma) return;

      console.log('Excluindo agente:', agente.id); // Log para debug
      
      const response = await api.delete(`/agente/${agente.id}`);
      
      if (response.status === 200) {
        alert('Agente excluído com sucesso!');
        // Recarrega a página para atualizar a lista
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(`Erro ao excluir agente: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      console.log('Dados recebidos para salvar:', formData); // Log para debug

      const dadosParaAPI = {
        id: formData.id, // Incluir o ID se estiver editando
        nome: formData.nome.trim(),
        tipo: formData.tipo,
        descricao: formData.descricao.trim(),
        telefone: formData.telefone.replace(/\D/g, ''), // Remove não-dígitos
        email: formData.email.trim(),
        id_cidade: parseInt(formData.cidade || formData.id_cidade),
        logradouro: formData.logradouro.trim(),
        numero: formData.numero.toString().trim(),
        cep: formData.cep.replace(/\D/g, ''), // Remove não-dígitos
        bairro: formData.bairro.trim(),
        complemento: formData.complemento ? formData.complemento.trim() : null
      };

      console.log('Dados formatados para API:', dadosParaAPI); // Log para debug

      let response;
      if (formData.id) {
        // Atualizar agente existente
        response = await api.put(`/agente/${formData.id}`, {
          ...dadosParaAPI,
          id: parseInt(formData.id)
        });
      } else {
        // Criar novo agente
        response = await api.post('/agente', dadosParaAPI);
      }

      if (response.status === 200 || response.status === 201) {
        alert(formData.id ? 'Agente atualizado com sucesso!' : 'Agente criado com sucesso!');
        setShowForm(false);
        setSelectedAgente(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Mostrar mensagens de erro específicas dos campos
      if (error.response?.data?.fieldMessages) {
        const mensagensErro = error.response.data.fieldMessages
          .map(fm => `${fm.field}: ${fm.message}`)
          .join('\n');
        alert(`Erros de validação:\n${mensagensErro}`);
      } else {
        alert(`Erro ao salvar agente: ${error.response?.data?.message || error.message}`);
      }
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleCadastrar = () => {
    console.log('Abrindo formulário');
    setShowForm(true);
    setSelectedAgente(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar 
          isAdmin={isAdmin} 
          onCadastrar={handleCadastrar}
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
                      console.log('Fechando formulário');
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
