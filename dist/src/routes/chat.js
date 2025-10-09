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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../../middlewares/auth-middlewares"); // CORRIGIDO: Usar authenticateJWT
const propertiesService = __importStar(require("../services/properties-services"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// CORRIGIDO: Aplicar o middleware authenticateJWT
router.post("/pergunta", auth_middlewares_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // ... (restante da lógica do chat)
    // ...
    const text = req.body.text;
    const apiKey = process.env.API_KEY;
    const apiUrl = process.env.API_URL;
    if (!apiKey || !apiUrl) {
        console.error("API_KEY ou API_URL não configurados no .env");
        return res.status(500).json({ error: "Configuração da API faltando." });
    }
    try {
        // Uso do service layer
        const propertiesResponse = yield propertiesService.getPropertiesService(1000, 0);
        const imoveis = (propertiesResponse.statusCode === 200 && Array.isArray(propertiesResponse.body))
            ? propertiesResponse.body
            : [];
        if (imoveis.length === 0) {
            return res.status(200).json({ ids: [], mensagemGeral: "Não há imóveis disponíveis no momento.", content: "" });
        }
        // Primeira chamada para o Gemini - obter os IDs dos imóveis
        const instrucoesImovel = `
Você é um assistente inteligente que ajuda usuários a encontrar imóveis com base em uma lista de dados.

1. Você receberá uma lista de imóveis no seguinte formato JSON, contendo o campo 'id' (inteiro) e outras informações úteis:
${JSON.stringify(imoveis)}

2. A tarefa é analisar a pergunta do usuário e retornar apenas os imóveis relevantes com base na intenção da pergunta.

3. Sua resposta DEVE ser exclusivamente um array JSON contendo apenas os IDs (inteiros) dos imóveis recomendados.
- Exemplo de formato válido: [1, 5, 10]
- Todos os IDs retornados devem existir na lista fornecida.

4. CASOS ESPECIAIS:
- Se a pergunta do usuário for uma saudação simples (ex: "oi", "bom dia", "boa tarde", "e aí", etc), responda com apenas uma saudação simpática e natural, sem colchetes nem números.
  - Exemplo: "Olá! Como posso te ajudar hoje?"
- Se a Pergunta do usuário for genérica ou irrelevante (ex: “qual o seu nome?”, “o que você faz?”, “me conte uma piada”):
   - Responda com uma frase simpática e útil, como:
     - "Sou seu assistente de imóveis! Posso te ajudar a encontrar algo para comprar ou alugar?"
- Se a pergunta não estiver relacionada a imóveis ou não houver imóveis relevantes na lista com base na pergunta, responda com:
  - "Imóvel não encontrado ou indisponível"

5. Lembre-se, você está atuando como funcionalidade em um sistema empresarial. 
-Se a pergunta do usuário seja mal intensionada (ex:"informações sensíveis dos imóveis", "dados sigilosos", etc), responda com um alerta de que não pode responder perguntas desse tipo.
-Se a pergunta do u
6. NÃO escreva nenhuma explicação, frase adicional ou texto fora do especificado acima.
Responda apenas conforme as instruções do caso aplicável.
`;
        const responseImovel = yield fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: instrucoesImovel }] },
                    { role: 'user', parts: [{ text: text }] }
                ],
            }),
        });
        if (!responseImovel.ok) {
            const errorData = yield responseImovel.json();
            console.error("Erro na resposta da API (Imóvel):", errorData);
            throw new Error(`Erro na requisição (Imóvel): ${responseImovel.status}`);
        }
        const dataImovel = yield responseImovel.json();
        const rawMsgImovel = (_e = (_d = (_c = (_b = (_a = dataImovel.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        let recommendedIds = [];
        let generalMessage = 'Recomendação baseada na sua busca.';
        try {
            const parsedIds = JSON.parse(rawMsgImovel);
            if (Array.isArray(parsedIds) && parsedIds.every((id) => Number.isInteger(id))) {
                recommendedIds = parsedIds;
            }
            else {
                generalMessage = (rawMsgImovel === null || rawMsgImovel === void 0 ? void 0 : rawMsgImovel.replace(/\*/g, '')) || 'O Gemini não pôde fornecer uma recomendação formatada.';
            }
        }
        catch (parseError) {
            console.warn("Gemini não retornou um array JSON de IDs válido, tratando como texto puro:", rawMsgImovel);
            generalMessage = (rawMsgImovel === null || rawMsgImovel === void 0 ? void 0 : rawMsgImovel.replace(/\*/g, '')) || 'Ocorreu um erro ou o Gemini não pôde processar sua solicitação.';
        }
        let explanationContent = '';
        // Segunda chamada para o Gemini - obter a explicação
        const search = `Explique como você chegou a esse resultado. Responda em no máximo 3 linhas e 100 caracteres.`;
        const responseExplanation = yield fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: `Pergunta original: ${text}, imoveis: ${JSON.stringify(imoveis)}, contexto: ${instrucoesImovel}` }] },
                    { role: 'model', parts: [{ text: `Resultado: ${rawMsgImovel}` }] },
                    { role: 'user', parts: [{ text: search }] }
                ],
            }),
        });
        if (responseExplanation.ok) {
            const dataExplanation = yield responseExplanation.json();
            explanationContent = (_k = (_j = (_h = (_g = (_f = dataExplanation.candidates) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.parts) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.text;
        }
        else {
            const errorData = yield responseExplanation.json();
            console.error("Erro na resposta da API (Explicação):", errorData);
        }
        // Responde com os resultados de ambas as chamadas
        res.status(200).json({
            ids: recommendedIds,
            mensagemGeral: generalMessage,
            content: explanationContent || ''
        });
    }
    catch (error) {
        console.error(`Erro ao enviar prompt para o Gemini: ${error}`);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}));
exports.default = router;
