// gabrielaanascimento/homesyncapi/homesyncapi-bc08270db04b9abb8982f5425eb1a72fa05c8c11/src/services/properties-services.ts
import * as httpResponse from "../utils/http-help";
import * as propertiesRepository from "../repositories/properties-repositories";
import { PropertyModel } from "../models/properties-models";
import { HttpResponse } from "../models/http-response-models";

const getPropertiesService = async (queryLimit: number, queryOffset: number) => {
// ... (lógica inalterada)
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
// ... (lógica inalterada)
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
// ... (lógica inalterada)
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
// ... (lógica inalterada)
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

// CORREÇÃO: Usa o ID do sistema (URL) para buscar o ID do catálogo (imovel_id)
const insertImovelImagesService = async (sistemaImovelId: number, filePaths: string[]): Promise<HttpResponse> => {
    try {
        // 1. Usa o ID do sistema (sistema_imoveis.id) para buscar a propriedade completa
        const propertyResponse = await getPropertyByIdService(sistemaImovelId); 
        
        if (propertyResponse.statusCode !== 200 || !propertyResponse.body) {
             console.error(`[DEBUG UPLOAD SERVICE] Falha ao buscar propriedade ${sistemaImovelId}. Status: ${propertyResponse.statusCode}`);
             return httpResponse.badRequest({ success: false, message: 'Imóvel não encontrado no sistema.' });
        }
        
        // 2. Extrai o ID do catálogo (`imovel_id`)
        const property = propertyResponse.body as PropertyModel;

        // NOVO DEBUG: Loga o objeto retornado para confirmar a presença do imovel_id
        console.log(`[DEBUG UPLOAD SERVICE] Objeto Property retornado para ID ${sistemaImovelId}:`, property); 
        
        const imovelId = property.imovel_id; // <-- ID CORRETO (imoveis.id)

        console.log(`[DEBUG UPLOAD SERVICE] ID do Sistema: ${sistemaImovelId} -> ID do Catálogo (imoveis.id) extraído: ${imovelId}`);


        if (!imovelId) {
             console.error('[DEBUG UPLOAD SERVICE] imovel_id está ausente no objeto retornado.');
             // Se imovel_id é null/undefined, significa que o JOIN no repositório falhou ou não existe.
             return httpResponse.badRequest({ success: false, message: 'ID do catálogo de imóvel ausente. (Verifique o JOIN no Repositório)' });
        }
        
        // 3. Passa o ID do catálogo para o repositório para inserção em imagens_imovel
        const isSuccess = await propertiesRepository.insertImovelImages(imovelId, filePaths);

        if (isSuccess) {
            console.log(`[DEBUG UPLOAD SERVICE] Sucesso na inserção de ${filePaths.length} caminhos de imagem para imovel_id: ${imovelId}`);
            return httpResponse.created({ 
                success: true, 
                message: `Imagens salvas com sucesso para o imóvel ID ${imovelId}.`,
                filePaths: filePaths
            });
        } else {
            // Se rowCount=0, a query não inseriu dados, indicando um erro de integridade de dados (e.g. FK)
            // que não foi lançado como exceção pelo driver.
            console.error(`[DEBUG UPLOAD SERVICE] Repositório retornou falha na inserção (rowCount=0) para imovel_id: ${imovelId}. Verifique a query SQL.`);
            return httpResponse.badRequest({ success: false, message: 'Falha ao salvar imagens no banco de dados. (Verifique a validade do ID no Catálogo)' });
        }
    } catch (error) {
        // Este catch captura erros de banco de dados (como o 23503)
        console.error('Erro **CRÍTICO** no serviço ao inserir imagens (Provavelmente DB):', error);
        return httpResponse.internalServerError({ success: false, message: 'Erro interno do servidor ao salvar imagens. Verifique a conexão ou a integridade do DB.' });
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