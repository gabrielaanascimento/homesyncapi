import { Request, Response } from "express";
import * as authService from "../services/auth-service.js";


export const login = async (req: Request, res: Response) => {
// ... (lógica inalterada, mas o serviço agora busca e retorna o nome)
    const { email, senha } = req.body; 

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios." });
    }

    try {
        const httpResponse = await authService.loginService(email, senha);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error('Erro interno do servidor na rota de login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
};

export const register = async (req: Request, res: Response) => {
    // Adicionado 'nome' como campo obrigatório para o cadastro
    const { nome, email, senha, CRECI, CPF, telefone } = req.body; 

    if (!nome || !email || !senha || !CRECI || !CPF || !telefone) {
        return res.status(400).json({ success: false, message: "Nome, email, senha, CRECI, telefone e CPF são obrigatórios para o cadastro." });
    }

    try {
        const httpResponse = await authService.registerService(nome, email, senha, CRECI, CPF, telefone);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error('Erro interno do servidor na rota de cadastro:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
};