"use strict";
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
exports.insertNewUser = exports.findUserByEmail = void 0;
const database_1 = require("../data/database");
// Tabela 'usuarios' substituída por 'corretores'
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.db.query("SELECT id, nome, email, senha, creci FROM corretores WHERE email = $1", // Incluindo 'nome'
    [email]);
    return result.rows[0] || null;
});
exports.findUserByEmail = findUserByEmail;
// Cadastro simples de corretor (incluindo 'nome')
const insertNewUser = (nome, email, senha, CRECI, CPF) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.db.query(`INSERT INTO corretores (nome, email, senha, creci, cpf)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nome, email, creci;`, [nome, email, senha, CRECI, CPF]);
    return result.rows[0] || null;
});
exports.insertNewUser = insertNewUser;
