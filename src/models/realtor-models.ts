import { PropertyModel } from "./properties-models.js";
//Terminar esta página de models com mais informações
//Realtor
export interface RealtorUserModel {
    id: string;
    name: string;
    email: string;
    tell: string;
    creci: string;
    propertyAnnouncements: PropertyModel[];
    responderContato(usuarioId: string, mensagem: string): void;
}