import { Alert } from 'react-native';
import * as alert from '../components/shared/AlertCustom';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../RootNavigation';
import { Produto } from 'src/interfaces/Produto';
import { Cliente } from 'src/interfaces/Cliente';
import { Pedido } from 'src/interfaces/Pedido';
import { Lote } from 'src/interfaces/Lote';

 
// PRODUTOS
async function saveProdutos(data: Produto[]) {
  try {
    await AsyncStorage.setItem('@MaoNaMassa:produtos', JSON.stringify(data));
    console.log('storage - saveProdutos - Produtos salvos');
  } catch (e) {
    alert.alertErro('Erro ao registrar Produtos no AsyncStorage: ' + e);
    //Alert.alert('Aviso', 'Erro ao registrar Produtos no AsyncStorage: ' + e);
  }
}

async function getProdutos() {
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:produtos');
    //console.log('VALORES: ', value);
    if(value !== null) {
      console.log('storage - getProdutos - Produtos recuperados');
      return JSON.parse(value);
    }
  } catch(e) {
    alert.alertErro('Erro ao buscar Produtos no AsyncStorage: ' + e);
    return;
  }
}

async function deleteProdutos() {
  try {
    await AsyncStorage.removeItem('@MaoNaMassa:produtos');
    return Promise.resolve();
  } catch(e) {
    return Promise.reject(e);
  }
}

// CLIENTES
async function saveClientes(data: Cliente[]) {
  try {
    await AsyncStorage.setItem('@MaoNaMassa:clientes', JSON.stringify(data));
    console.log('storage - saveClientes - Clientes salvos');
  } catch (e) {
    alert.alertErro('Erro ao registrar Clientes no AsyncStorage: ' + e);
  }
}

async function getClientes() { 
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:clientes');
    //console.log('VALORES: ', value);
    if(value !== null) {
      console.log('storage - getClientes - Clientes recuperados');
      return JSON.parse(value);
    }
  } catch(e) {
    alert.alertErro('Erro ao buscar Clientes no AsyncStorage: ' + e);
    return;
  }
}


// PEDIDOS
async function savePedidos(data: Pedido[]) {
  try {
    await AsyncStorage.setItem('@MaoNaMassa:pedidos', JSON.stringify(data));
    console.log('storage - savePedidos - Pedidos salvos');
  } catch (e) {
    alert.alertErro('Erro ao registrar Pedidos no AsyncStorage: ' + e);
  }
}

async function getPedidos() { 
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:pedidos');
    //console.log('VALORES: ', value);
    if(value !== null) {
      console.log('storage - getPedidos - Pedidos recuperados');
      return JSON.parse(value);
    }
  } catch(e) {
    alert.alertErro('Erro ao buscar Pedidos no AsyncStorage: ' + e);
    return;
  }
}

async function findPedido(id: number) { 
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:pedidos');
    if(value !== null) {
      let pedidos = JSON.parse(value);
      let pedido = pedidos.find((el: Pedido) => el.id === id);
      return pedido;
    }
  } catch(e) {
    alert.alertErro('Erro ao buscar Pedido ' + id + ' no AsyncStorage: ' + e);
    return;
  }
}


// LOTES
async function saveLotes(data: Lote[]) {
  try {
    await AsyncStorage.setItem('@MaoNaMassa:lotes', JSON.stringify(data));
    console.log('storage - saveLotes - Lotes salvos');
  } catch (e) {
    alert.alertErro('Erro ao registrar Lotes no AsyncStorage: ' + e);
  }
}

async function getLotes() { 
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:lotes');
    //console.log('VALORES: ', value);
    if(value !== null) {
      console.log('storage - getLotes - Lotes recuperados');
      return JSON.parse(value);
    }
  } catch(e) {
    alert.alertErro('Erro ao buscar Lotes no AsyncStorage: ' + e);
    return;
  }
}

async function existPedidoNoLote(pedido_id: number) { 
  try {
    const lotes = await AsyncStorage.getItem('@MaoNaMassa:lotes');
    const lotesObj = JSON.parse(lotes!);
    //const pedido = pedidos.find( (e => e.id === id), id);
    let ped;
    let existe = false;
    lotesObj.forEach( (lote: Lote) => {
      ped = lote.pedidos.some( pedido => pedido.pedido_id === pedido_id, pedido_id);
      if (ped) {
        existe = true;
      }
    });
    return existe;
  } catch(e) {
    alert.alertErro('Erro ao buscar Lotes no AsyncStorage: ' + e);
    return;
  }
}


export {
  saveProdutos, getProdutos, deleteProdutos, 
  saveClientes, getClientes, 
  savePedidos, getPedidos, findPedido,
  saveLotes, getLotes, existPedidoNoLote, 
}
