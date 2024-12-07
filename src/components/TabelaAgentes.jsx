import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSearchParams } from 'react-router-dom';

import '../css/index.css'
import '../css/index_clientes.css';

export const TabelaAgentes = ({ isAdmin, onEdit, onDelete }) => {
  const [agentes, setAgentes] = useState([]);
  const [searchParams] = useSearchParams();
  const [expandedRow, setExpandedRow] = useState(null);
  const tipo = searchParams.get('tipo');

  const nomeBonitoParaOTipo = (tipo) => {
    const tipos = {
      'PREINCUBADORA': 'Pré-Incubadora',
      'INCUBADORA': 'Incubadora',
      'ACELERADORA': 'Aceleradora'
    };
    return tipos[tipo] || 'Not Found';
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderExpandedInfo = (agente) => {
    return `Nome: ${agente.nome}
Tipo: ${nomeBonitoParaOTipo(agente.tipo)}
Telefone: ${agente.telefone}
Email: ${agente.email}
Cidade: ${agente.cidade?.nome ?? ""}
Logradouro: ${agente.logradouro}
Numero: ${agente.numero}
CEP: ${agente.cep}
Bairro: ${agente.bairro}
Complemento: ${agente.complemento ?? "Nada consta"}
Descrição: ${agente.descricao ?? "Nada consta"}`;
  };

  useEffect(() => {
    const carregarAgentes = async () => {
      try {
        const response = await api.get("/agente");
        if (response.status === 200) {
          const listaFiltrada = response.data
            .filter(agente => !tipo || agente.tipo === tipo)
            .sort((a, b) => a.id - b.id);
          setAgentes(listaFiltrada);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        alert(`Erro não Mapeado: ${err.message}`);
      }
    };

    carregarAgentes();
  }, [tipo]);

  return (
    <div className="tabela-clientes">
      <div className="tabela-conteiner">
        <table>
          <thead>
            <tr>
              {isAdmin && <th style={{width: "10%"}}>Ações</th>}
              <th style={{width: "30%"}}>Nome</th>
              <th style={{width: "100%"}}>Tipo</th>
              <th style={{width: "100%"}}>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {agentes.map(agente => (
              <>
                <tr key={agente.id}>
                  {isAdmin && (
                    <td>
                      <button onClick={() => onEdit(agente)}>Editar</button>
                      <button 
                        onClick={() => onDelete(agente)}
                        style={{
                          backgroundColor: '#ff4444',
                          color: 'white',
                          marginLeft: '5px'
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                  <td onClick={() => toggleExpand(agente.id)} style={{cursor: 'pointer'}}>
                    {agente.nome}
                  </td>
                  <td onClick={() => toggleExpand(agente.id)} style={{cursor: 'pointer'}}>
                    {nomeBonitoParaOTipo(agente.tipo)}
                  </td>
                
                  <td onClick={() => toggleExpand(agente.id)} style={{cursor: 'pointer'}}>
                    {`${agente.cidade?.nome ?? ""}`}
                  </td>
                </tr>
                {expandedRow === agente.id && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} style={{
                      whiteSpace: "pre-line",
                      textAlign: "left",
                      padding: "15px",
                      backgroundColor: "#f8f9fa"
                    }}>
                      {renderExpandedInfo(agente)}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 