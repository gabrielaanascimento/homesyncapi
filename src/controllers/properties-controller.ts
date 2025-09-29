import { Request, Response } from 'express';
import * as PropertyService from '../services/properties-services';
import { AuthRequest } from '../../middlewares/auth-middlewares';


export const PropertiesController = {
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

  async uploadImovelImages(req: AuthRequest, res: Response) {
    const imovelId = Number(req.params.id);
    const files = req.files as Express.Multer.File[]; // Multer define req.files como um array para .array()

    if (!imovelId) {
        return res.status(400).json({ success: false, message: 'O ID do imóvel é obrigatório.' });
    }
    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Nenhuma imagem foi enviada.' });
    }
    
    // Obtém array dos caminhos dos arquivos salvos
    const filePaths = files.map(file => file.path);

    try {
        // Nota: Idealmente, o serviço deve verificar a existência do imóvel
        const httpResponse = await PropertyService.insertImovelImagesService(imovelId, filePaths);
        return res.status(httpResponse.statusCode).json(httpResponse.body);

    } catch (error) {
        console.error('Erro ao fazer upload de imagens:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor ao salvar imagens.' });
    }
  }
};
