import React, { createContext, useState, useEffect, useContext } from 'react';

import * as alert from '../components/shared/AlertCustom';
import api from '../services/api';
import { Usuario } from 'src/interfaces/Usuario';

interface UsuarioContextData {
  usuarios: Usuario[] | null;
  totalRows: number;
  loading: boolean;
  setNewStateUsuarios(usuario: Usuario[]): void; 
  getStateUsuarios(): Usuario[];
  loadDataUsuarioApi(ehAdmin: boolean): void;
}

const UsuarioContext = createContext<UsuarioContextData>({} as UsuarioContextData);

export const UsuarioProvider: React.FC = ({children}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('UsuarioProvider - useEffect - Entrou');
    //loadDataApi(); // Está dando erro. Tenta carregar antes de estar logado.
  }, [])

  async function loadDataUsuarioApi(ehAdmin: boolean) {
    console.log('UsuarioProvider - loadDataUsuarioApi');
    if (ehAdmin) {
      try {
        let response;
        setLoading(true);
        response = await api.get('users'); 
        //console.log('usuarioContext - RESPONSE', response.data)
        setUsuarios(response.data);
        setTotalRows(response.headers['x-total-count']);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert.alertErroOps(err);
      }
    }       
  }

  function setNewStateUsuarios(usuarios: Usuario[]): void {
    console.log('UsuarioProvider - setNewStateUsuarios');
    setUsuarios(usuarios);       
  }

  function getStateUsuarios(): Usuario[] {
    console.log('UsuarioProvider - getStateUsuarios');
    return usuarios!;       
  }

  return (
    <UsuarioContext.Provider 
      value={{ usuarios, totalRows, loadDataUsuarioApi, setNewStateUsuarios, getStateUsuarios, loading}}>
      {children}
    </UsuarioContext.Provider>
  );
};

export function useUsuario() {
  const context = useContext(UsuarioContext);
  return context;
}
