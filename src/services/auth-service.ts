import * as authRepository from "../repositories/auth-repository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as httpResponse from "../utils/http-help.js";
import { HttpResponse } from "../models/http-response-models.js";
import { AuthCorretorModel } from "../models/users-models.js";

const SECRET_KEY = process.env.JWT_SECRET || "HNSHBCSBSBnkcskhcnsndncskcsnksncsnsns";

const loginService = async (email: string, senha: string): Promise<HttpResponse> => {
    const user: AuthCorretorModel | null = await authRepository.findUserByEmail(email); 

    if (!user || !user.senha) {
// ... (lógica inalterada)
        return httpResponse.unauthorized({ success: false, message: 'Email ou senha inválidos.' });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha); 

    if (passwordMatch) {
// ... (lógica inalterada)
        const payload = { 
            userId: user.id, 
            email: user.email, 
            roles: ['corretor'], 
            creci: user.CRECI
        };
        
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        const { senha, ...userWithoutSenha } = user;

        return httpResponse.ok({
            success: true,
            message: 'Login bem-sucedido!', 
            token: token,
            name: user.nome, // Agora retorna o nome real para a UI
            id: user.id 
        });

    } else {
        return httpResponse.unauthorized({ success: false, message: 'Email ou senha inválidos.' });
    }
};

// O cadastro agora exige 'nome'
const registerService = async (nome: string, email: string, senha: string, CRECI: string, CPF: string, telefone: string): Promise<HttpResponse> => {
    
    if (!nome || !email || !senha || !CRECI || !CPF || !telefone) {
        return httpResponse.badRequest({ success: false, message: 'Nome, email, senha, CRECI, telefone e CPF são obrigatórios.' });
    }

    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
        return httpResponse.conflict({ success: false, message: 'Corretor com este email já existe.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await authRepository.insertNewUser(nome, email, hashedPassword, CRECI, CPF, telefone);

    if (newUser) {
        return httpResponse.created({ success: true, message: 'Corretor registrado com sucesso!', user: newUser });
    } else {
        return httpResponse.badRequest({ success: false, message: 'Falha ao registrar o corretor.' });
    }
};

export {
    loginService,
    registerService
}