import React, { createContext, useState, useEffect, useContext } from 'react';

import * as alert from '../components/shared/AlertCustom';
import api from '../services/api';
import { Lote } from 'src/interfaces/Lote';

interface LoteContextData {
  lotes: Lote[] | null;
  totalRows: number;
  loading: boolean;
  setNewStateLotes(lote: Lote[]): void; 
  getStateLotes(): Lote[];
  loadDataLoteApi(ehAdmin: boolean): void;
  existPedidoNoLote(pedido_id: number): boolean;
}

const LoteContext = createContext<LoteContextData>({} as LoteContextData);

export const LoteProvider: React.FC = ({children}) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('LoteProvider - useEffect - Entrou');
    //loadDataApi(); // Está dando erro. Tenta carregar antes de estar logado.
  }, [])

  async function loadDataLoteApi(ehAdmin: boolean) {
    console.log('LoteProvider - loadDataLoteApi');
    try {
      let response;
      setLoading(true);
      response = await api.get('lotes'); 
      //const response = await api.get<Lote[]>('lotes', { params: { } });
      setLotes(response.data);
      setTotalRows(response.headers['x-total-count']);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert.alertErroOps(err);
    }       
  }

  function setNewStateLotes(lotes: Lote[]): void {
    console.log('LoteProvider - setNewStateLotes');
    setLotes(lotes);       
  }

  function getStateLotes(): Lote[] {
    console.log('LoteProvider - getStateLotes');
    return lotes!;       
  }

  function existPedidoNoLote(pedido_id: number): boolean { 
    let ped;
    let existe = false;
    lotes.forEach( (lote: Lote) => {
      ped = lote.pedidos.some( pedido => pedido.pedido_id === pedido_id, pedido_id);
      if (ped) {
        existe = true;
      }
    });
    return existe;
  }

  return (
    <LoteContext.Provider 
      value={{ 
        lotes, totalRows, loading, 
        loadDataLoteApi, setNewStateLotes, getStateLotes, existPedidoNoLote 
      }}>
      {children}
    </LoteContext.Provider>
  );
};

export function useLote() {
  const context = useContext(LoteContext);
  return context;
}

//export default AuthContext;