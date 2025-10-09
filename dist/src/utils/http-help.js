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
exports.internalServerError = exports.conflict = exports.unauthorized = exports.created = exports.badRequest = exports.noContent = exports.ok = void 0;
//caso precise, implementar novas reponses
// Terminar de aplicar esta padronização em todas as outras páginas
const ok = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        statusCode: 200,
        body: data,
    };
});
exports.ok = ok;
const created = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = { message: "successful" }) {
    return {
        statusCode: 201,
        body: data
    };
});
exports.created = created;
const noContent = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        statusCode: 204,
        body: null,
    };
});
exports.noContent = noContent;
const badRequest = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = null) {
    return {
        statusCode: 400,
        body: data
    };
});
exports.badRequest = badRequest;
const unauthorized = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = null) {
    return {
        statusCode: 401,
        body: data
    };
});
exports.unauthorized = unauthorized;
const conflict = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = null) {
    return {
        statusCode: 409,
        body: data
    };
});
exports.conflict = conflict;
const internalServerError = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = { message: "Internal Server Error" }) {
    return {
        statusCode: 500,
        body: data
    };
});
exports.internalServerError = internalServerError;
