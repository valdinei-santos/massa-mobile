import React, { createContext, useState, useEffect, useContext } from 'react';

import * as alert from '../components/shared/AlertCustom';
import api from '../services/api';
import { Produto } from 'src/interfaces/Produto';

interface ProdutoContextData {
  produtos: Produto[] | null;
  totalRows: number;
  loading: boolean;
  setNewStateProdutos(produto: Produto[]): void; 
  getStateProdutos(): Produto[];
  loadDataProdutoApi(): void;
}

const ProdutoContext = createContext<ProdutoContextData>({} as ProdutoContextData);

export const ProdutoProvider: React.FC = ({children}) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ProdutoProvider - useEffect - Entrou');
    //loadDataApi(); // Está dando erro. Tenta carregar antes de estar logado.
  }, [])

  async function loadDataProdutoApi() {
    console.log('ProdutoProvider - loadDataProdutoApi');
    try {
      let response;
      setLoading(true);
      response = await api.get('produtos'); 
      //const response = await api.get<Produto[]>('produtos', { params: { } });
      setProdutos(response.data);
      setTotalRows(response.headers['x-total-count']);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert.alertErroOps(err);
    }       
  }

  function setNewStateProdutos(produtos: Produto[]): void {
    console.log('ProdutoProvider - setNewStateProdutos');
    setProdutos(produtos);       
  }

  function getStateProdutos(): Produto[] {
    console.log('ProdutoProvider - getStateProdutos');
    return produtos!;       
  }

  return (
    <ProdutoContext.Provider 
      value={{ produtos, totalRows, loadDataProdutoApi, setNewStateProdutos, getStateProdutos, loading}}>
      {children}
    </ProdutoContext.Provider>
  );
};

export function useProduto() {
  const context = useContext(ProdutoContext);
  return context;
}

//export default AuthContext;