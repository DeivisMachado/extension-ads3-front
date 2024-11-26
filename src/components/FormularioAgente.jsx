import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/index.css';
import '../css/index_criar.css';

export const FormularioAgente = ({ agente, onSave, onClose }) => {
  const [formData, setFormData] = useState(agente || {
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
    complemento: ''
  });
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    const carregarCidades = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/cidade");
        if (response.status === 200) {
          setCidades(response.data);
        }
      } catch (err) {
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
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setFormData(prev => ({
      ...prev,
      telefone: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="fundo">
          <div className="background"></div>
          <div className="card">
            <h2>{agente ? 'Atualizar Agente' : 'Novo Agente'}</h2>
            <div className="form">
              <input type="number" style={{display: 'none'}} id="id" value={formData.id || ''} onChange={handleChange} />
              
              <label>Nome <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Projeto X" 
                id="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />

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

              <label>Descrição <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Descreva seu projeto aqui..." 
                id="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />

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

              <label>E-mail <span style={{color: 'red'}}>*</span></label>
              <input 
                type="email" 
                placeholder="exemplo@exemplo.com.br" 
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Cidade <span style={{color: 'red'}}>*</span></label>
              <select 
                name="cidade" 
                id="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              >
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>

              <label>Logradouro <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Rua, Av, ..." 
                id="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                required
              />

              <label>Número <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="45A" 
                id="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />

              <label>CEP <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="XXXXX-XXX" 
                id="cep"
                value={formData.cep}
                onChange={handleChange}
                required
              />

              <label>Bairro <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                placeholder="Jardim Oliveira" 
                id="bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />

              <label>Complemento</label>
              <input 
                type="text" 
                placeholder="Bloco D, ao lado de..." 
                id="complemento"
                value={formData.complemento || ''}
                onChange={handleChange}
              />

              <button type="button" onClick={handleSubmit}>Salvar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 