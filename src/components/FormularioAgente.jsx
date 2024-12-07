import { useState, useEffect } from 'react';
import api from '../services/api';
import './FormularioAgente.css';

export const FormularioAgente = ({ agente, onSave, onClose }) => {
  console.log('FormularioAgente renderizado', { agente });
  
  useEffect(() => {
    console.log('Modal deve estar visível agora');
  }, []);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'PREINCUBADORA',
    descricao: '',
    telefone: '',
    email: '',
    cidade: '',
    logradouro: '',
    numero: '',
    cep: '',
    bairro: '',
    complemento: '',
    ...agente
  });

  useEffect(() => {
    if (agente) {
      setFormData(prev => ({
        ...prev,
        ...agente,
        cidade: agente.cidade?.id || agente.id_cidade || '',
      }));
    }
  }, [agente]);

  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    const carregarCidades = async () => {
      try {
        const response = await api.get("/cidade");
        if (response.status === 200) {
          setCidades(response.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        alert(`Erro ao carregar cidades: ${err.message}`);
      }
    };

    carregarCidades();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePhone = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    
    // Formata o número
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      telefone: value
    }));
  };

  const handleCep = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos
    
    // Formata o CEP
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      cep: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    const requiredFields = ['nome', 'tipo', 'descricao', 'telefone', 'email', 'cidade', 'logradouro', 'numero', 'cep', 'bairro'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    // Validações específicas
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) {
      alert('Por favor, insira um telefone válido com DDD');
      return;
    }

    if (formData.cep && formData.cep.replace(/\D/g, '').length !== 8) {
      alert('Por favor, insira um CEP válido');
      return;
    }

    try {
      const dadosFormatados = {
        ...formData,
        id: agente?.id ? parseInt(agente.id) : undefined,
        cidade: undefined, // Remove o objeto cidade
        id_cidade: parseInt(formData.cidade)
      };

      console.log('Dados formatados para envio:', dadosFormatados);
      await onSave(dadosFormatados);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o agente. Por favor, tente novamente.');
    }
  };

  return (
    <div className="modal" onClick={(e) => {
      if (e.target.className === 'modal') onClose();
    }}>
      <div className="modal-content">
        <div className="fundo">
          <div className="background"></div>
          <div className="card">
            <h2>{agente ? 'Atualizar Agente' : 'Novo Agente'}</h2>
            <div className="form">
              <input type="number" style={{display: 'none'}} id="id" value={formData.id || ''} onChange={handleChange} />
              <div className="input-group">
                <label>Nome <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Projeto X" 
                  id="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
              <label>Tipo <span style={{color: 'red'}}>*</span></label>
              <select 
                name="tipo" 
                id="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="PREINCUBADORA">Pré-Incubadora</option>
                <option value="INCUBADORA">Incubadora</option>
                <option value="ACELERADORA">Aceleradora</option>
              </select>
              </div>

              <div className="input-group">
              <label>Descrição <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Descreva seu projeto aqui..." 
                id="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
              </div>

              <div className="input-group">
              <label>Telefone <span style={{color: 'red'}}>*</span></label>
              <input 
                type="tel" 
                placeholder="(XX) XXXXX-XXXX" 
                id="telefone"
                maxLength="15"
                value={formData.telefone}
                onChange={handlePhone}
                required
              />
              </div>

              <div className="input-group">
              <label>E-mail <span style={{color: 'red'}}>*</span></label>
              <input 
                type="email" 
                placeholder="exemplo@exemplo.com.br" 
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              </div>

              <div className="input-group">
              <label>Cidade <span style={{color: 'red'}}>*</span></label>
              <select 
                name="cidade" 
                id="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma cidade</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              </div>
              
              <div className="input-group">
              <label>Logradouro <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Rua, Av, ..." 
                id="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                required
              />
              </div>

              <div className="input-group">
              <label>Número <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="45A" 
                id="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />
              </div>

              <div className="input-group">
              <label>CEP <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="XXXXX-XXX" 
                id="cep"
                value={formData.cep}
                onChange={handleCep}
                maxLength="9"
                required
              />
              </div>

              <div className="input-group">
              <label>Bairro <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Jardim Oliveira" 
                id="bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
              </div>

              <div className="input-group">
              <label>Complemento</label>
              <input 
                type="text" 
                placeholder="Bloco D, ao lado de..." 
                id="complemento"
                value={formData.complemento || ''}
                onChange={handleChange}
              />
              </div>
              
            </div>
            <div className="button-group">
              <button type="button" onClick={handleSubmit}>Salvar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 