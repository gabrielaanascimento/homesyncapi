"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const authService = __importStar(require("../services/auth-service"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada, mas o serviço agora busca e retorna o nome)
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios." });
    }
    try {
        const httpResponse = yield authService.loginService(email, senha);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    catch (error) {
        console.error('Erro interno do servidor na rota de login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Adicionado 'nome' como campo obrigatório para o cadastro
    const { nome, email, senha, CRECI, CPF } = req.body;
    if (!nome || !email || !senha || !CRECI || !CPF) {
        return res.status(400).json({ success: false, message: "Nome, email, senha, CRECI e CPF são obrigatórios para o cadastro." });
    }
    try {
        const httpResponse = yield authService.registerService(nome, email, senha, CRECI, CPF);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    catch (error) {
        console.error('Erro interno do servidor na rota de cadastro:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
    }
});
exports.register = register;
