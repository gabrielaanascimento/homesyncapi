import * as httpResponse from "../utils/http-help";
import * as propertiesRepository from "../repositories/properties-repositories";
import { PropertyModel } from "../models/properties-models";
import { HttpResponse } from "../models/http-response-models";

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

// P8 FIX: Altera a assinatura para Omit<PropertyModel, "id"> e lida com o novo retorno (ID)
const createPropertyService = async(property: Omit<PropertyModel, "id" | "imovel_id">) => { // CORRIGIDO
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

const insertImovelImagesService = async (imovelId: number, filePaths: string[]): Promise<HttpResponse> => {
    try {
        const isSuccess = await propertiesRepository.insertImovelImages(imovelId, filePaths);

        if (isSuccess) {
            return httpResponse.created({ 
                success: true, 
                message: `Imagens salvas com sucesso para o imóvel ID ${imovelId}.`,
                filePaths: filePaths
            });
        } else {
            return httpResponse.badRequest({ success: false, message: 'Falha ao salvar imagens no banco de dados.' });
        }
    } catch (error) {
        console.error('Erro no serviço ao inserir imagens:', error);
        return httpResponse.internalServerError({ success: false, message: 'Erro interno do servidor.' });
    }
};

export {
    getPropertyByIdService,
    getPropertiesService,
    createPropertyService,
    deletePropertyService,
    updatePropertyService,
    insertImovelImagesService, // EXPORT NEW FUNCTION
}