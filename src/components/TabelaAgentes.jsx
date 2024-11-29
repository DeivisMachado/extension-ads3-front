import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSearchParams } from 'react-router-dom';

export const TabelaAgentes = ({ isAdmin, onEdit, onDelete }) => {
  const [agentes, setAgentes] = useState([]);
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo');

  const nomeBonitoParaOTipo = (tipo) => {
    const tipos = {
      'PREINCUBADORA': 'Pré-Incubadora',
      'INCUBADORA': 'Incubadora',
      'ACELERADORA': 'Aceleradora'
    };
    return tipos[tipo] || 'Not Found';
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
              {isAdmin && <th style={{width: "5%"}}>Ações</th>}
              <th style={{width: "10%"}}>Nome</th>
              <th style={{width: "20%"}}>Descrição</th>
              <th style={{width: "8%"}}>Tipo</th>
              <th style={{width: "15%"}}>Contato</th>
              <th style={{width: "18%"}}>Endereço</th>
              
            </tr>
          </thead>
          <tbody>
            {agentes.map(agente => (
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
                <td>{agente.nome}</td>
                <td>{agente.descricao}</td>
                <td>{nomeBonitoParaOTipo(agente.tipo)}</td>
                <td style={{whiteSpace: "pre-line"}}>
                  {`Telefone: ${agente.telefone}\nEmail: ${agente.email}`}
                </td>
                <td style={{whiteSpace: "pre-line"}}>
                  {`Cidade: ${agente.cidade?.nome ?? ""}\nLogradouro: ${agente.logradouro}\nNumero: ${agente.numero}\nCEP: ${agente.cep}\nBairro: ${agente.bairro}\nComplemento: ${agente.complemento ?? "Nada consta."}`}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 