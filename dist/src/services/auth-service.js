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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = exports.loginService = void 0;
const authRepository = __importStar(require("../repositories/auth-repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpResponse = __importStar(require("../utils/http-help"));
const SECRET_KEY = process.env.JWT_SECRET || "HNSHBCSBSBnkcskhcnsndncskcsnksncsnsns";
const loginService = (email, senha) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authRepository.findUserByEmail(email);
    if (!user || !user.senha) {
        // ... (lógica inalterada)
        return httpResponse.unauthorized({ success: false, message: 'Email ou senha inválidos.' });
    }
    const passwordMatch = yield bcrypt_1.default.compare(senha, user.senha);
    if (passwordMatch) {
        // ... (lógica inalterada)
        const payload = {
            userId: user.id,
            email: user.email,
            roles: ['corretor'],
            creci: user.CRECI
        };
        const token = jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        const { senha } = user, userWithoutSenha = __rest(user, ["senha"]);
        return httpResponse.ok({
            success: true,
            message: 'Login bem-sucedido!',
            token: token,
            name: user.nome, // Agora retorna o nome real para a UI
            id: user.id
        });
    }
    else {
        return httpResponse.unauthorized({ success: false, message: 'Email ou senha inválidos.' });
    }
});
exports.loginService = loginService;
// O cadastro agora exige 'nome'
const registerService = (nome, email, senha, CRECI, CPF) => __awaiter(void 0, void 0, void 0, function* () {
    if (!nome || !email || !senha || !CRECI || !CPF) {
        return httpResponse.badRequest({ success: false, message: 'Nome, email, senha, CRECI e CPF são obrigatórios.' });
    }
    const existingUser = yield authRepository.findUserByEmail(email);
    if (existingUser) {
        return httpResponse.conflict({ success: false, message: 'Corretor com este email já existe.' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(senha, 10);
    const newUser = yield authRepository.insertNewUser(nome, email, hashedPassword, CRECI, CPF);
    if (newUser) {
        return httpResponse.created({ success: true, message: 'Corretor registrado com sucesso!', user: newUser });
    }
    else {
        return httpResponse.badRequest({ success: false, message: 'Falha ao registrar o corretor.' });
    }
});
exports.registerService = registerService;
