import * as PropertyService from '../services/properties-services.js';
import { internalServerError } from '../utils/http-help.js';
export const PropertiesController = {
    async listAll(req, res) {
        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;
        const rows = await PropertyService.getPropertiesService(limit, offset);
        return res.json(rows);
    },
    async getById(req, res) {
        const id = Number(req.params.id);
        const imovel = await PropertyService.getPropertyByIdService(id);
        if (!imovel)
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        return res.json(imovel);
    },
    async create(req, res) {
        const data = req.body;
        const created = await PropertyService.createPropertyService(data);
        return res.status(201).json(created);
    },
    async update(req, res) {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await PropertyService.updatePropertyService(id, data);
        if (!updated)
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        return res.json(updated);
    },
    async remove(req, res) {
        const id = Number(req.params.id);
        await PropertyService.deletePropertyService(id);
        return res.status(204).send();
    },
    async uploadImovelImages(req, res) {
        const imovelId = Number(req.params.id);
        const files = req.files; // Multer define req.files como um array para .array()
        console.log(`[DEBUG UPLOAD] Imóvel ID (Sistema): ${imovelId}`);
        // Loga os arquivos recebidos. Se for [], o cliente não enviou ou o Multer falhou.
        console.log(`[DEBUG UPLOAD] Arquivos recebidos:`, files);
        if (!imovelId) {
            return res.status(400).json({ success: false, message: 'O ID do imóvel é obrigatório.' });
        }
        if (!files || files.length === 0) {
            // CORREÇÃO DE FLUXO: Se o Multer falhou sem um MulterError (ou se o cliente enviou 0 arquivos), 
            // a rota continua, e o controller deve retornar 400.
            console.error('[DEBUG UPLOAD] Erro: Nenhuma imagem recebida no controller (files.length é 0).');
            return res.status(400).json({ success: false, message: 'Nenhuma imagem foi enviada.' });
        }
        // Obtém array dos caminhos dos arquivos salvos
        const filePaths = files.map(file => file.path);
        try {
            const httpResponse = await PropertyService.insertImovelImagesService(imovelId, filePaths);
            return res.status(httpResponse.statusCode).json(httpResponse.body);
        }
        catch (error) {
            console.error('Erro ao fazer upload de imagens:', error);
            const internalError = await internalServerError('Erro interno do servidor ao salvar imagens.');
            return res.status(internalError.statusCode).json(internalError.body);
        }
    }
};
