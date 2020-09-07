import { PedidoItem } from './PedidoItem';

export interface Pedido {
    id?: number,
    dt_pedido: string;
    status_id: number;
    pago: number;
    observacao: string;
    cliente_id: number;
    user_id: number;
    itens: PedidoItem[];
    nomeCliente?: string;
    nomeVendedor?: string;
}
