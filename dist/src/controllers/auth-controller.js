import * as authService from "../services/auth-service.js";
export const login = async (req, res) => {
    // ... (lógica inalterada, mas o serviço agora busca e retorna o nome)
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios." });
    }
    try {
        const httpResponse = await authService.loginService(email, senha);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    catch (error) {
        console.error('Erro interno do servidor na rota de login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
};
export const register = async (req, res) => {
    // Adicionado 'nome' como campo obrigatório para o cadastro
    const { nome, email, senha, CRECI, CPF } = req.body;
    if (!nome || !email || !senha || !CRECI || !CPF) {
        return res.status(400).json({ success: false, message: "Nome, email, senha, CRECI e CPF são obrigatórios para o cadastro." });
    }
    try {
        const httpResponse = await authService.registerService(nome, email, senha, CRECI, CPF);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    catch (error) {
        console.error('Erro interno do servidor na rota de cadastro:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
};
