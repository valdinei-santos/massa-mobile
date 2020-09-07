import React, { createContext, useState, useEffect, useContext } from 'react';

import * as alert from '../components/shared/AlertCustom';
import api from '../services/api';
import { Cliente } from 'src/interfaces/Cliente';

interface ClienteContextData {
  clientes: Cliente[] | null;
  totalRows: number;
  loading: boolean;
  setNewStateClientes(cliente: Cliente[]): void; 
  getStateClientes(): Cliente[];
  loadDataClienteApi(ehAdmin: boolean, user_id: number): void;
}

const ClienteContext = createContext<ClienteContextData>({} as ClienteContextData);

export const ClienteProvider: React.FC = ({children}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ClienteProvider - useEffect - Entrou');
    //loadDataApi(); // Está dando erro. Tenta carregar antes de estar logado.
  }, [])

  async function loadDataClienteApi(ehAdmin: boolean, user_id: number) {
    console.log('ClienteProvider - loadDataClienteApi');
    try {
      let response;
      setLoading(true);
      if (ehAdmin) {
        response = await api.get('clientes'); 
      } else {
        response = await api.get('clientes', { params: { user_id: user_id } });
      }
      //const response = await api.get<Cliente[]>('clientes', { params: { } });
      setClientes(response.data);
      setTotalRows(response.headers['x-total-count']);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert.alertErroOps(err);
    }       
  }

  function setNewStateClientes(clientes: Cliente[]): void {
    console.log('ClienteProvider - setNewStateClientes');
    setClientes(clientes);       
  }

  function getStateClientes(): Cliente[] {
    console.log('ClienteProvider - getStateClientes');
    return clientes!;       
  }


  return (
    <ClienteContext.Provider 
      value={{ clientes, totalRows, loadDataClienteApi, setNewStateClientes, getStateClientes, loading}}>
      {children}
    </ClienteContext.Provider>
  );
};

export function useCliente() {
  const context = useContext(ClienteContext);
  return context;
}

//export default AuthContext;