import { LotePedido } from "./LotePedido";

export interface Lote {
    id?: number;
    dt_lote: string;
    status_id: number;
    observacao: string;
    pedidos: LotePedido[];
}
