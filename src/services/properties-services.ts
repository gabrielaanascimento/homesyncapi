// src/services/properties-services.ts

import * as httpResponse from "../utils/http-help.js";
import * as propertiesRepository from "../repositories/properties-repositories.js";
import { PropertyModel } from "../models/properties-models.js";
import { HttpResponse } from "../models/http-response-models.js";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configuração do Cloudinary (deve ser feita na inicialização do app, mas por segurança pode ser reafirmada aqui)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função auxiliar para fazer upload de um buffer para o Cloudinary
const uploadFromBuffer = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};


// ... (outras funções do serviço como getPropertiesService, createPropertyService, etc. permanecem iguais)
const getPropertiesService = async (queryLimit: number, queryOffset: number) => {
    const dataProperties = await propertiesRepository.findAllProperties(queryLimit, queryOffset);
    let response: HttpResponse;
    if(dataProperties && dataProperties.length > 0) {
        response = await httpResponse.ok(dataProperties);
    } else {
        response = await httpResponse.noContent();
    }
    return response;
};
const getPropertyByIdService = async (id:number) => {
    const dataProperty = await propertiesRepository.findPropertyById(id);
    let response: HttpResponse;
    if(dataProperty){
        response = await httpResponse.ok(dataProperty);
    } else {
        response = await httpResponse.noContent();
    }
    return response;
};
const createPropertyService = async(property: Omit<PropertyModel, "id" | "imovel_id">) => {
    let response: HttpResponse;
    if(Object.keys(property).length != 0) {
        try {
            const newSistemaId = await propertiesRepository.insertProperty(property as any)
            if (newSistemaId) {
                response = await httpResponse.created({ id: newSistemaId, message: "Property created successfully" });
            } else {
                 response = await httpResponse.badRequest({ message: "Failed to insert property" });
            }
        } catch (error) {
            console.error("Erro no serviço de criação:", error);
            response = await httpResponse.internalServerError({ message: "Erro interno do servidor ao criar a propriedade." });
        }
    } else {
        response = await httpResponse.badRequest();
    }
    return response;
};
const deletePropertyService = async(id: number) => {
    let response: HttpResponse;
    const isDeleted = await propertiesRepository.deletePropertyById(id);
    if(isDeleted) {
        response = await httpResponse.ok({ message: "deleted" });
    } else {
        response = await httpResponse.badRequest();
    }
    return response;
}
const updatePropertyService = async(id: number, propertyData: Partial<PropertyModel>)  => {
    let responseUpdate: HttpResponse;
    try{
        const updatedProperty = await propertiesRepository.updatePropertyById(id, propertyData);
            if (updatedProperty && typeof updatedProperty === "object" && Object.keys(updatedProperty).length !== 0) {
                responseUpdate = await httpResponse.ok(updatedProperty);
                return responseUpdate;
            } else {
                responseUpdate = await httpResponse.badRequest();
                return responseUpdate;
            }
    }catch(err:any){
        responseUpdate = await httpResponse.badRequest();
        return responseUpdate;
    }
}
// FUNÇÃO MODIFICADA
const insertImovelImagesService = async (sistemaImovelId: number, files: Express.Multer.File[]): Promise<HttpResponse> => {
    try {
        const propertyResponse = await getPropertyByIdService(sistemaImovelId);
        if (propertyResponse.statusCode !== 200 || !propertyResponse.body) {
            return httpResponse.badRequest({ success: false, message: 'Imóvel não encontrado no sistema.' });
        }

        const property = propertyResponse.body as PropertyModel;
        const imovelId = property.imovel_id;

        if (!imovelId) {
            return httpResponse.badRequest({ success: false, message: 'ID do catálogo de imóvel ausente.' });
        }

        // 1. Fazer upload de todas as imagens para o Cloudinary em paralelo
        const uploadPromises = files.map(file => uploadFromBuffer(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);

        // 2. Extrair as URLs seguras dos resultados
        const imageUrls = uploadResults.map(result => result.secure_url);

        // 3. Passar as URLs para o repositório salvar no banco de dados
        const isSuccess = await propertiesRepository.insertImovelImages(imovelId, imageUrls);

        if (isSuccess) {
            return httpResponse.created({
                success: true,
                message: `Imagens salvas com sucesso para o imóvel ID ${imovelId}.`,
                imageUrls: imageUrls
            });
        } else {
            return httpResponse.badRequest({ success: false, message: 'Falha ao salvar URLs das imagens no banco de dados.' });
        }
    } catch (error) {
        console.error('Erro CRÍTICO no serviço ao inserir imagens (Cloudinary ou DB):', error);
        return httpResponse.internalServerError({ success: false, message: 'Erro interno do servidor ao salvar imagens.' });
    }
};

export {
    getPropertyByIdService,
    getPropertiesService,
    createPropertyService,
    deletePropertyService,
    updatePropertyService,
    insertImovelImagesService,
}