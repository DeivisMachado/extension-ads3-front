export interface Agente {
    id?: number;
    nome: string;
    telefone: string;
    descricao: string;
    email: string;
    tipo: 'PREINCUBADORA' | 'INCUBADORA' | 'ACELERADORA';
    logradouro: string;
    bairro: string;
    cep: string;
    cidade: {
        id: number;
        nome: string;
    };
    numero: string;
    complemento?: string;
}

export interface Cidade {
    id: number;
    nome: string;
} 