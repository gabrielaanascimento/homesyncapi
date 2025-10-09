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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.insertUser = exports.updateUserById = exports.findUserById = void 0;
exports.findAllUsers = findAllUsers;
const database_1 = require("../data/database");
// Atualizado com os novos campos (nome, vendas_anual, conversao_final, conversao_data)
const CORRETOR_FIELDS = 'id, nome, email, creci, cpf, afiliacao, celular, descricao, avaliacao, vendas_anual, conversao_final, conversao_data, caracteristicas, foto';
const TABLE_NAME = 'corretores';
function findAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.db.query(`SELECT ${CORRETOR_FIELDS} FROM ${TABLE_NAME}`);
        return result.rows;
    });
}
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.db.query(`SELECT ${CORRETOR_FIELDS} FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
});
exports.findUserById = findUserById;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ... (lógica inalterada, usa os novos campos do model)
    const keys = Object.keys(data).filter(key => key !== 'id');
    const values = Object.values(data);
    if (keys.length === 0)
        return false;
    const setString = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const query = `UPDATE ${TABLE_NAME} SET ${setString} WHERE id = $${keys.length + 1}`;
    const result = yield database_1.db.query(query, [...values, id]);
    return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
});
exports.updateUserById = updateUserById;
const insertUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { nome, email, CRECI, CPF } = newUser, rest = __rest(newUser, ["nome", "email", "CRECI", "CPF"]);
    if (!nome || !email || !CRECI || !CPF) {
        throw new Error("Missing required fields: nome, email, CRECI, CPF");
    }
    const allKeys = ['nome', 'email', 'creci', 'cpf', ...Object.keys(rest)];
    const allValues = [nome, email, CRECI, CPF, ...Object.values(rest)];
    const columns = allKeys.join(", ");
    const params = allKeys.map((_, idx) => `$${idx + 1}`).join(", ");
    const result = yield database_1.db.query(`INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${params}) RETURNING id`, allValues);
    return (_b = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
});
exports.insertUser = insertUser;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ... (lógica inalterada)
    const result = yield database_1.db.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
});
exports.deleteUserById = deleteUserById;
