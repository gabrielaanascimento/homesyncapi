import * as httpResponse from "../utils/http-help.js";
import * as userRepository from "../repositories/users-repositories.js";
//Terminar de testar e implementar alguma nova função, caso necessário
const getUserService = async () => {
    const dataUsers = await userRepository.findAllUsers();
    let response;
    if (dataUsers) {
        response = await httpResponse.ok(dataUsers);
    }
    else {
        response = await httpResponse.noContent();
    }
    return response;
};
const getUserByIdService = async (id) => {
    // ... (lógica inalterada)
    const dataUser = await userRepository.findUserById(id);
    let response;
    if (dataUser) {
        response = await httpResponse.ok(dataUser);
    }
    else {
        response = await httpResponse.noContent();
    }
    return response;
};
const createUserService = async (user) => {
    let response;
    if (Object.keys(user).length != 0) {
        await userRepository.insertUser(user);
        response = await httpResponse.created();
    }
    else {
        response = await httpResponse.badRequest();
    }
    return response;
};
const deleteUserService = async (id) => {
    // ... (lógica inalterada)
    let response;
    const isDeleted = await userRepository.deleteUserById(id);
    if (isDeleted) {
        response = await httpResponse.ok({ message: "deleted" });
    }
    else {
        response = await httpResponse.badRequest();
    }
    return response;
};
const updateUserService = async (id, userData) => {
    let responseUpdate;
    try {
        const updateUser = await userRepository.updateUserById(id, userData);
        if (updateUser && updateUser === true) {
            responseUpdate = await httpResponse.ok(await userRepository.findUserById(id));
            return responseUpdate;
        }
        else {
            responseUpdate = await httpResponse.badRequest();
            return responseUpdate;
        }
    }
    catch (err) {
        responseUpdate = await httpResponse.badRequest();
        return responseUpdate;
    }
};
export { getUserByIdService, getUserService, createUserService, deleteUserService, updateUserService, };
