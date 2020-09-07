import React, { createContext, useState, useEffect, useContext } from 'react';

import * as alert from '../components/shared/AlertCustom';
import api from '../services/api';
import { Pedido } from 'src/interfaces/Pedido';

interface PedidoContextData {
  pedidos: Pedido[] | null;
  totalRows: number;
  loading: boolean;
  setNewStatePedidos(pedido: Pedido[]): void; 
  getStatePedidos(): Pedido[];
  loadDataPedidoApi(ehAdmin: boolean, user_id: number): void;
}

const PedidoContext = createContext<PedidoContextData>({} as PedidoContextData);

export const PedidoProvider: React.FC = ({children}) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('PedidoProvider - useEffect - Entrou');
    //loadDataApi(); // Está dando erro. Tenta carregar antes de estar logado.
  }, [])

  async function loadDataPedidoApi(ehAdmin: boolean, user_id: number) {
    console.log('PedidoProvider - loadDataPedidoApi');
    console.log('IDD', user_id)
    try {
      let response;
      setLoading(true);
      if (ehAdmin) {
        response = await api.get('pedidos'); 
      } else {
        response = await api.get('pedidos', { params: { user_id: user_id } });
      }
      //const response = await api.get<Pedido[]>('pedidos', { params: { } });
      setPedidos(response.data);
      setTotalRows(response.headers['x-total-count']);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert.alertErroOps(err);
    }       
  }

  function setNewStatePedidos(pedidos: Pedido[]): void {
    console.log('PedidoProvider - setNewStatePedidos');
    setPedidos(pedidos);       
  }

  function getStatePedidos(): Pedido[] {
    console.log('PedidoProvider - getStatePedidos');
    return pedidos!;       
  }

  return (
    <PedidoContext.Provider 
      value={{ pedidos, totalRows, loadDataPedidoApi, setNewStatePedidos, getStatePedidos, loading}}>
      {children}
    </PedidoContext.Provider>
  );
};

export function usePedido() {
  const context = useContext(PedidoContext);
  return context;
}

//export default AuthContext;