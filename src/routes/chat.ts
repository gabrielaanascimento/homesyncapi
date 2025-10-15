import { Router, Request, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../../middlewares/auth-middlewares.js'; // CORRIGIDO: Usar authenticateJWT
import * as propertiesService from '../services/properties-services.js';
import env from "dotenv"
env.config()

const router = Router();

// Define uma interface para o corpo da requisição POST
interface ChatRequest extends AuthRequest {
    body: {
        text: string;
    }
}

// CORRIGIDO: Aplicar o middleware authenticateJWT
router.post("/pergunta", async (req: ChatRequest, res: Response) => { 
// ... (restante da lógica do chat)
// ...
    const text = req.body.text;

    const apiKey = process.env.API_KEY as string;
    const apiUrl = process.env.API_URL as string;

    if (!apiKey || !apiUrl) {
         console.error("API_KEY ou API_URL não configurados no .env");
         return res.status(500).json({ error: "Configuração da API faltando." });
    }

    try {
        // Uso do service layer
        const propertiesResponse = await propertiesService.getPropertiesService(1000, 0); 
        
        const imoveis = (propertiesResponse.statusCode === 200 && Array.isArray(propertiesResponse.body)) 
            ? propertiesResponse.body 
            : [];
        
        if (imoveis.length === 0) {
             return res.status(200).json({ ids: [], mensagemGeral: "Não há imóveis disponíveis no momento.", content: "" });
        }
        
        console.log(`Número de imóveis disponíveis para recomendação: ${imoveis[0]}`);
        

        // Primeira chamada para o Gemini - obter os IDs dos imóveis
        const instrucoesImovel = `
Você é um assistente inteligente que ajuda usuários a encontrar imóveis com base em uma lista de dados.

1. Você receberá uma lista de imóveis no seguinte formato JSON, contendo o campo 'id' (inteiro) e outras informações úteis:
${JSON.stringify(imoveis)}

2. A tarefa é analisar a pergunta do usuário e retornar apenas os imóveis relevantes com base na intenção da pergunta.

3. Sua resposta DEVE ser exclusivamente um array JSON contendo apenas os IDs do campo "imovel_id" (inteiros) dos imóveis recomendados.
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
        const responseImovel = await fetch(apiUrl, {
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
            const errorData = await responseImovel.json();
            console.error("Erro na resposta da API (Imóvel):", errorData);
            throw new Error(`Erro na requisição (Imóvel): ${responseImovel.status}`);
        }

        const dataImovel = await responseImovel.json();
        const rawMsgImovel = dataImovel.candidates?.[0]?.content?.parts?.[0]?.text;

        let recommendedIds: number[] = [];
        let generalMessage = 'Recomendação baseada na sua busca.';

        try {
            const parsedIds = JSON.parse(rawMsgImovel);
            if (Array.isArray(parsedIds) && parsedIds.every((id: any) => Number.isInteger(id))) {
                recommendedIds = parsedIds;
            } else {
                generalMessage = rawMsgImovel?.replace(/\*/g, '') || 'O Gemini não pôde fornecer uma recomendação formatada.';
            }
        } catch (parseError) {
            console.warn("Gemini não retornou um array JSON de IDs válido, tratando como texto puro:", rawMsgImovel);
            generalMessage = rawMsgImovel?.replace(/\*/g, '') || 'Ocorreu um erro ou o Gemini não pôde processar sua solicitação.';
        }

        let explanationContent = '';

        // Segunda chamada para o Gemini - obter a explicação
        const search = `Explique como você chegou a esse resultado. Responda em no máximo 3 linhas e 100 caracteres.`;
        
        const responseExplanation = await fetch(apiUrl, {
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
            const dataExplanation = await responseExplanation.json();
            explanationContent = dataExplanation.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
             const errorData = await responseExplanation.json();
             console.error("Erro na resposta da API (Explicação):", errorData);
        }

        // Responde com os resultados de ambas as chamadas
        res.status(200).json({
            ids: recommendedIds,
            mensagemGeral: generalMessage,
            content: explanationContent || ''
        });

    } catch (error) {
        console.error(`Erro ao enviar prompt para o Gemini: ${error}`);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

export default router;