import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Platform, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
//import moment from 'moment';
//import 'moment/locale/pt-br';
import PedidoItem from '../../components/pedidos/PedidoItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../commonStyles';
import AsyncStorage from '@react-native-community/async-storage';
import * as alert from '../../components/shared/AlertCustom';
import * as storage from '../../services/storage';

import { Pedido } from 'src/interfaces/Pedido';
import api from '../../services/api';
import { usePedido } from '../../contexts/pedidoContext';
//import { Pedido } from 'src/interfaces/Pedido.ts.old';
//import { getDataUsuario } from '../../services/user';
import * as storageUsuario from '../../services/storage-usuario';
import Axios, { AxiosResponse, AxiosError } from 'axios';

type ParamList = {
  PedidoList: {
    umPedido: Pedido;
    ehEdit: boolean;
  };
};

//export default function PedidoList()  {
const PedidoList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PedidoList'>>();
  const { pedidos, setNewStatePedidos } = usePedido();
  const [umPedido, setUmPedido] = useState({});
  //const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const { loadDataPedidoApi } = usePedido();
  const [refreshing, setRefreshing] = useState(false);

  /* const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []); */

  useEffect(() => {
    console.log('PedidoList - useEffect INIT');
    //loadPedidosApi();
    //loadPedidosStorage();
    /* getDataUsuario()
            .then((res) => {
                navigation.setOptions({title: res.name});
                setUsuario(res);
            }); */
  }, []);

  useEffect(() => {
    console.log('PedidoList - useEffect Voltou PedidoAdd');
    if (route.params?.umPedido) {
      console.log('Voltou com umPedido');
      if (route.params?.ehEdit) {
        updatePedido(route.params?.umPedido);
      } else {
        savePedido(route.params?.umPedido);
      }
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.umPedido]);

  useEffect(() => {
    console.log('PedidoList - useEffect pedidos');
  }, [pedidos]);
    
  /* async function loadPedidosStorage() {
        setPedidos(await storage.getPedidos());
    } */

  // Para carregar os dados da API
  /* async function loadPedidosApi() {
        console.log('PedidoList - loadPedidos');
        if (spinner) {
            return;
        }
        if (totalRow > 0 && pedidos.length == totalRow) {
            return;
        }
        try {
            setSpinner(true);
            //const response = await api.get('pedidos', { params: { page } });
            const response = await api.get('pedidos', { params: { } });
            //console.log('PEDIDO VEIO', response.data[0].itens);
            setPedidos([ ...pedidos, ...response.data]); // Esta anexando 2 array em 1
            setTotalRow(response.headers['x-total-count']);
            //setPage(page + 1);
            setSpinner(false);
        } catch (err) {
            setSpinner(false);
            alert.alertErroOps(err);
        }
        
    } */

  //useEffect(() => {
  //    console.log('useEffect ...');
  //
  //}, []);

  function sortArrayPedidos(arrayUnsort: Pedido[]) {
    // Para ordenar um campo só
    const arraySort = arrayUnsort.sort( (a, b) => { 
      let x = b.id;
      let y = a.id;
      if (Number(x)  < Number(y)) {return -1;}
      if (Number(x) > Number(y)) {return 1;}
      return 0;
    });
    return arraySort;
  }
    
  function savePedido(data: Pedido) {
    console.log('PedidoList - Save');
    //const maxId = Math.max.apply(Math, pedidos.map(function(el) { return el.id; }));
    //data.id = maxId + 1;
    //setPedidos([...pedidos, data]);
    const arrayPedidos = [...pedidos!, data]; 
    const arrayPedidosOrder = sortArrayPedidos(arrayPedidos);
    //setPedidos(arrayPedidosOrder);
    setNewStatePedidos(arrayPedidosOrder);
    //storage.savePedidos(arrayPedidosOrder);
  }

  function updatePedido(data: Pedido) {
    console.log('PedidoList - Update', data);
    const othersPedidos = pedidos!.filter(e => e.id !== data.id);
    //setPedidos([...othersPedidos, data]);
    const arrayPedidos = [...othersPedidos, data]; 
    const arrayPedidosOrder = sortArrayPedidos(arrayPedidos);
    //setPedidos(arrayPedidosOrder);
    setNewStatePedidos(arrayPedidosOrder);
    //storage.savePedidos(arrayPedidosOrder);
  }

  async function deletePedido(id: number) {
    console.log('PedidoList - Delete');
    //try {
    setSpinner(true);
    api.delete<AxiosResponse>('pedidos/' + id)
      .then((response: AxiosResponse) => {
        setSpinner(false);
        if (response.status === 200) {
          const newPedidos = pedidos!.filter(pedido => pedido.id !== id);
          setNewStatePedidos(newPedidos);
          alert.alertOk('Pedido Excluido!');
          return;
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      })
      .catch((error: AxiosError) => {
        setSpinner(false);
        let err = JSON.stringify(error.response?.data);
        console.log(error.response?.data)
        //alert.alertErroOps(error.message);
        alert.alertErroOps(err);
        return;
      })

    /*   const response = await api.delete('pedidos/' + id);
      console.log('RESPONSE::::', response);
      setSpinner(false);
      if (response.status === 200) {
        const newPedidos = pedidos!.filter(pedido => pedido.id !== id);
        setNewStatePedidos(newPedidos);
        alert.alertOk('Pedido Excluido!');
        return;
      } else {
        throw 'Erro ' + response.status + ' no acesso API';
      }
    } catch(err) {
      console.log('RESPONSE ERROR::::', err.request._response);
      setSpinner(false);
      alert.alertErroOps(err.request.msg);
      //Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`);
      return;
    } */
  }

  function editPedido(id: number) {
    console.log('PedidoList - Edit ', id);
    const pedido = pedidos!.find( ((e: Pedido) => e.id === id), id);
    console.log('PedidoList editPedido', pedido);
    navigation.navigate('PedidoAdd', { pedido: pedido });
  }

  function goPedidoAdd() {
    console.log('PedidoList - goPedidoAdd');
    // navigation.navigate('PedidoAdd', { savePedido: savePedido, umPedido: {} });
    navigation.navigate('PedidoAdd', { umPedido: {} });
    // Navegando para outra tela e passando uma função de callback para o retorno
    // this.props.navigation.navigate('PedidoAdd', { savePedido: this.savePedido });
  }

  function goPedidoShow(id: number) {
    console.log('PedidoList - goPedidoShow ', id);
    const pedido = pedidos!.find( (e => e.id === id), id);
    console.log('PedidoList - goPedidoShow PEDIDO', pedido);
    navigation.navigate('PedidoShow', { pedido: pedido });
  }

  async function goReload() {
    console.log('PedidoList - RELOAD');
    const usuarioLogado = await storageUsuario.getUsuario();
    loadDataPedidoApi(usuarioLogado.fl_admin === 1, usuarioLogado?.id);
  }

  return (
    <View style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <View style={styles.body}>
        <FlatList 
          refreshControl=
            {<RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={refreshing}
              onRefresh={goReload} />
            }
          data={pedidos} 
          keyExtractor={item => `${item.id}`}
          //showsVerticalScrollIndicator={false}
          //onEndReached={loadPedidos} // Funcao que é disparada quando usuário chega no final da lista
          //onEndReachedThreshold={0.2} // Quando usuário estiver 20% do final da lista carrega novos itens
          renderItem={({ item }) => 
            <PedidoItem {...item} 
              onDelete={() => deletePedido(item.id as number)} 
              onEdit={() => editPedido(item.id as number)} 
              goPedidoShow={() => goPedidoShow(item.id as number)} />  
                             
          }
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goPedidoAdd}
        style={styles.TouchableOpacityStyle}>
        <Icon name='plus' size={20} color={commonStyles.colors.white} />
      </TouchableOpacity>
    </View>
        
  );
   
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#F5FCFF",
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  title: {
    // fontFamily: any,
    color: '#334455',
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  /* titleBar: {
        flex: 2,
        justifyContent: 'flex-end',
    }, */
  body: {
    flex: 1,
  },
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: commonStyles.colors.maonamassa2,
    borderRadius: 25,
  },

});

export default PedidoList;
