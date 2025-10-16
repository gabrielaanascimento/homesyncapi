// src/controllers/properties-controller.ts

import { Request, Response } from 'express';
import * as PropertyService from '../services/properties-services.js';
import { AuthRequest } from '../../middlewares/auth-middlewares.js';
import { internalServerError } from '../utils/http-help.js';


export const PropertiesController = {
  // ... (outros métodos como listAll, getById, etc. permanecem iguais)
  async listAll(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const rows = await PropertyService.getPropertiesService(limit, offset);
    return res.json(rows);
  },
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const imovel = await PropertyService.getPropertyByIdService(id);
    if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado' });
    return res.json(imovel);
  },
  async create(req: Request, res: Response) {
    const data = req.body;
    const created = await PropertyService.createPropertyService(data);
    return res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await PropertyService.updatePropertyService(id, data);
    if (!updated) return res.status(404).json({ message: 'Imóvel não encontrado' });
    return res.json(updated);
  },
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await PropertyService.deletePropertyService(id);
    return res.status(204).send();
  },
  // MÉTODO MODIFICADO
  async uploadImovelImages(req: AuthRequest, res: Response) {
    const imovelId = Number(req.params.id);
    const files = req.files as Express.Multer.File[];

    if (!imovelId) {
        return res.status(400).json({ success: false, message: 'O ID do imóvel é obrigatório.' });
    }
    
    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Nenhuma imagem foi enviada.' });
    }
    
    try {
        // Passa o array de arquivos completo para o serviço
        const httpResponse = await PropertyService.insertImovelImagesService(imovelId, files);
        return res.status(httpResponse.statusCode).json(httpResponse.body);

    } catch (error) {
        console.error('Erro no controller ao fazer upload de imagens:', error);
        const internalError = await internalServerError('Erro interno do servidor ao salvar imagens.');
        return res.status(internalError.statusCode).json(internalError.body);
    }
  }
};