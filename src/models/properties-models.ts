// Refatorado para o novo schema 'Sistema_Imoveis'
export interface PropertyModel {
    id: number;
    corretor_id?: number; 
    cliente_vendedor_id?: number;
    tipo_imovel: 'Casa' | 'Apartamento' | 'Terreno' | 'SalaComercial';
    status: 'Disponível' | 'Vendida' | 'Alugada';
    endereco?: string;
    area_construida?: number;
    andar?: number;
    preco?: number;
    descricao?: string;

    imovel_id: number;

}