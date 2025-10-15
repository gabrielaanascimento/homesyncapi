//caso precise, implementar novas reponses
// Terminar de aplicar esta padronização em todas as outras páginas
const ok = async (data) => {
    return {
        statusCode: 200,
        body: data,
    };
};
const created = async (data = { message: "successful" }) => {
    return {
        statusCode: 201,
        body: data
    };
};
const noContent = async () => {
    return {
        statusCode: 204,
        body: null,
    };
};
const badRequest = async (data = null) => {
    return {
        statusCode: 400,
        body: data
    };
};
const unauthorized = async (data = null) => {
    return {
        statusCode: 401,
        body: data
    };
};
const conflict = async (data = null) => {
    return {
        statusCode: 409,
        body: data
    };
};
const internalServerError = async (data = { message: "Internal Server Error" }) => {
    return {
        statusCode: 500,
        body: data
    };
};
export { ok, noContent, badRequest, created, unauthorized, conflict, internalServerError, };
