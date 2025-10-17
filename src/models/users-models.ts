// Refatorado para o novo schema 'Corretores' com campos da página de perfil
export interface CorretorModel {
    id: number;
    nome: string; // Adicionado: Campo para o nome do corretor (Mario Souza)
    email: string;
    // O campo 'senha' é tratado apenas na camada de autenticação (AuthCorretorModel)
    CRECI: string; 
    CPF: string;
    afiliacao?: string;
    celular?: string;
    descricao?: string; // Descrição/Bio
    avaliacao?: number; // Avaliação média (4.25/5)
    vendas_anual?: number; // Vendas Anuais (900 Ano)
    conversao_final?: number; // Taxa de conversão final (45.00%)
    conversao_data?: any; // JSONB para dados do gráfico de conversão
    caracteristicas?: string; // Características
    foto?: string;
}

// Model para uso no processo de Autenticação (tabela 'corretores')
export interface AuthCorretorModel {
    id: number;
    email: string;
    senha?: string; // Hashed password
    CRECI: string; 
    nome: string; // Incluído para payload
    celular: string; // Incluído para payload
}