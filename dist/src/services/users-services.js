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
exports.updateUserService = exports.deleteUserService = exports.createUserService = exports.getUserService = exports.getUserByIdService = void 0;
const httpResponse = __importStar(require("../utils/http-help"));
const userRepository = __importStar(require("../repositories/users-repositories"));
//Terminar de testar e implementar alguma nova função, caso necessário
const getUserService = () => __awaiter(void 0, void 0, void 0, function* () {
    const dataUsers = yield userRepository.findAllUsers();
    let response;
    if (dataUsers) {
        response = yield httpResponse.ok(dataUsers);
    }
    else {
        response = yield httpResponse.noContent();
    }
    return response;
});
exports.getUserService = getUserService;
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada)
    const dataUser = yield userRepository.findUserById(id);
    let response;
    if (dataUser) {
        response = yield httpResponse.ok(dataUser);
    }
    else {
        response = yield httpResponse.noContent();
    }
    return response;
});
exports.getUserByIdService = getUserByIdService;
const createUserService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    if (Object.keys(user).length != 0) {
        yield userRepository.insertUser(user);
        response = yield httpResponse.created();
    }
    else {
        response = yield httpResponse.badRequest();
    }
    return response;
});
exports.createUserService = createUserService;
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // ... (lógica inalterada)
    let response;
    const isDeleted = yield userRepository.deleteUserById(id);
    if (isDeleted) {
        response = yield httpResponse.ok({ message: "deleted" });
    }
    else {
        response = yield httpResponse.badRequest();
    }
    return response;
});
exports.deleteUserService = deleteUserService;
const updateUserService = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    let responseUpdate;
    try {
        const updateUser = yield userRepository.updateUserById(id, userData);
        if (updateUser && updateUser === true) {
            responseUpdate = yield httpResponse.ok(yield userRepository.findUserById(id));
            return responseUpdate;
        }
        else {
            responseUpdate = yield httpResponse.badRequest();
            return responseUpdate;
        }
    }
    catch (err) {
        responseUpdate = yield httpResponse.badRequest();
        return responseUpdate;
    }
});
exports.updateUserService = updateUserService;
