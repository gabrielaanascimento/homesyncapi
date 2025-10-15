import * as service from "../services/users-services.js";
import { noContent } from "../utils/http-help.js";
export const getUser = async (req, res) => {
    // ... (lógica inalterada)
    const httpResponse = await service.getUserService();
    res.status(httpResponse.statusCode).json(httpResponse.body);
};
export const getUserById = async (req, res) => {
    // ... (lógica inalterada)
    const id = parseInt(req.params.id);
    const httpResponse = await service.getUserByIdService(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};
export const postUser = async (req, res) => {
    const bodyValue = req.body; // CORRIGIDO
    const httpResponse = await service.createUserService(bodyValue);
    if (httpResponse) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    else {
        const response = await noContent();
        res.status(response.statusCode).json(response.body);
    }
};
export const deleteUser = async (req, res) => {
    // ... (lógica inalterada)
    let response = null;
    const id = parseInt(req.params.id);
    const httpResponse = await service.deleteUserService(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};
export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const bodyValue = req.body; // CORRIGIDO
    const httpResponse = await service.updateUserService(id, bodyValue);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};
export const uploadCorretorPhoto = async (req, res) => {
    // ... (lógica inalterada)
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo de foto foi enviado.' });
    }
    const userId = req.user?.userId;
    // O caminho do arquivo salvo (e.g., uploads/corretores/corretor-123.jpg)
    const photoPath = req.file.path;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }
    try {
        // Usa o serviço existente para atualizar o campo 'foto'
        const updateResult = await service.updateUserService(userId, { foto: photoPath });
        if (updateResult.statusCode === 200) {
            return res.status(200).json({
                success: true,
                message: 'Foto de perfil salva com sucesso.',
                filePath: photoPath
            });
        }
        else {
            // Lide com o erro aqui, talvez deletando o arquivo salvo
            return res.status(updateResult.statusCode).json(updateResult.body);
        }
    }
    catch (error) {
        console.error('Erro ao salvar foto do corretor:', error);
        return res.status(500).json({ success: false, message: 'Erro interno ao processar a foto.' });
    }
};
// CORRIGIDO: Exportar todas as funções para o roteador
