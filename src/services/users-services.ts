import * as httpResponse from "../utils/http-help";
import * as userRepository from "../repositories/users-repositories";
import { CorretorModel } from "../models/users-models"; // CORRIGIDO
import { HttpResponse } from "../models/http-response-models";
//Terminar de testar e implementar alguma nova função, caso necessário
const getUserService = async () => {
    const dataUsers = await userRepository.findAllUsers();
    let response: HttpResponse;
    
    if(dataUsers) {
        response = await httpResponse.ok(dataUsers);
    } else {
        response = await httpResponse.noContent();
    }
    return response;
};

const getUserByIdService = async (id:number) => {
// ... (lógica inalterada)
    const dataUser = await userRepository.findUserById(id);
    let response: HttpResponse;

    if(dataUser){
        response = await httpResponse.ok(dataUser);
    } else {
        response = await httpResponse.noContent();
    }
    return response;
};

const createUserService = async(user: Omit<CorretorModel, "id">) => { // CORRIGIDO
    let response: HttpResponse;
    
    if(Object.keys(user).length != 0) {
        await userRepository.insertUser(user as any)
        response = await httpResponse.created();

    } else {
        response = await httpResponse.badRequest();
    }
    return response;
};

const deleteUserService = async(id: number) => {
// ... (lógica inalterada)
    let response: HttpResponse;
    const isDeleted = await userRepository.deleteUserById(id);

    if(isDeleted) {
        response = await httpResponse.ok({ message: "deleted" });
    } else {
        response = await httpResponse.badRequest();
    }

    return response;
}

const updateUserService = async(id: number, userData: Partial<CorretorModel>)  => { // CORRIGIDO
    let responseUpdate: HttpResponse;
    try{
        const updateUser = await userRepository.updateUserById(id, userData);
            if (updateUser && updateUser === true) {
                responseUpdate = await httpResponse.ok(await userRepository.findUserById(id));
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

export {
    getUserByIdService,
    getUserService,
    createUserService,
    deleteUserService,
    updateUserService,
}