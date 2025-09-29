import { HttpResponse } from "../models/http-response-models";
//caso precise, implementar novas reponses
// Terminar de aplicar esta padronização em todas as outras páginas
const ok = async (data:any): Promise<HttpResponse> => {
    return {
        statusCode: 200,
        body: data,
    };
};

const created = async (data:any = { message: "successful" }): Promise<HttpResponse> => {
    return {
        statusCode: 201,
        body: data
    }
}

const noContent = async (): Promise<HttpResponse> => {
    return {
        statusCode: 204,
        body: null,
    }
};

const badRequest = async(data: any = null): Promise<HttpResponse> => {
    return {
        statusCode: 400,
        body: data
    }
}

const unauthorized = async(data: any = null): Promise<HttpResponse> => {
    return {
        statusCode: 401,
        body: data
    }
}

const conflict = async(data: any = null): Promise<HttpResponse> => {
    return {
        statusCode: 409,
        body: data
    }
}

const internalServerError = async(data: any = { message: "Internal Server Error" }): Promise<HttpResponse> => {
    return {
        statusCode: 500,
        body: data
    }
}

export {
    ok,
    noContent,
    badRequest,
    created,
    unauthorized,
    conflict,
    internalServerError, 
}