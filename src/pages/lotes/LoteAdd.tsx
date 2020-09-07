import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../commonStyles';
import * as alert from '../../components/shared/AlertCustom';
import * as storageUsuario from '../../services/storage-usuario';

import api from '../../services/api';
import PedidoItem from '../../components/pedidos/PedidoItem';
import { Lote } from 'src/interfaces/Lote';
import { Pedido } from 'src/interfaces/Pedido';
import { usePedido } from '../../contexts/pedidoContext';
import { useLote } from '../../contexts/loteContext';

type ParamList = {
  LoteAdd: {
    lote: Lote;
    //ehSearch: boolean;
    //ehEdit: boolean;
  };
};

/* type PedidoNoLote = {
    nomeVendedor: string;
    nomeCliente: string;
} & Pedido */

type CheckPedidos = {
  idPedido: number;
  check: boolean;
}

type IdPedido = {
  pedido_id: number;
}

//export default function LoteAdd() {
const LoteAdd: React.FC = () => { 
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LoteAdd'>>();
  //const { loadDataLoteApi } = useLote();
  //const [umLote, setUmLote] = useState({});
  const { pedidos, loadDataPedidoApi } = usePedido();
  const [lote, setLote] = useState<Lote>();
  const [pedidosPendente, setPedidosPendente] = useState<Pedido[]>([]);
  const [listaCheckPedidos, setListaCheckPedidos] = useState<CheckPedidos[]>([]);
  const [dateNow, setDateNow] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [showButton, setShowButton] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [arrayComIdPedidos, setArrayComIdPedidos] = useState<IdPedido[]>([]);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  //const [loading, setLoading] = useState(false);
  const [ehEdit, setEhEdit] = useState(false);
  const [spinner, setSpinner] = useState(false);


  useEffect(() => {
    console.log('LoteAdd - useEffect INIT');
    function filtraPedidosPendente() {
      const newPedidosPendente = pedidos?.filter(e => e.status_id === 1);
      setPedidosPendente(newPedidosPendente!);
    }
    filtraPedidosPendente();
    const newListaCheckPedidos: CheckPedidos[] = [];
        pedidosPendente?.forEach(el => {
          newListaCheckPedidos.push({idPedido: el.id!, check: false})
        });
        setListaCheckPedidos(newListaCheckPedidos);
  }, []);

  /* useEffect(() => {
        console.log('LoteAdd - useEffect INIT');
        //loadPedidosApi();
        //filtraPedidosPendente();
    }, []); */

  useEffect(() => {
    console.log('LoteAdd - useEffect lote como parametro');
    if (route.params?.lote) {
      console.log('LoteAdd - useEffect - o lote: ', route.params?.lote)
      setLote(route.params?.lote);
      //montaOsChecksDoLote(route.params?.lote);
      setEhEdit(true);
      navigation.setOptions({title: 'Alteração Lote'});
    }
  }, [route.params?.lote]);

  useEffect(() => {
    console.log('LoteAdd - useEffect listaCheckPedidos');
    onShowButton();
  }, [listaCheckPedidos]);

  useEffect(() => {
    console.log('LoteAdd - useEffect alteração do LOTE');
    if (ehEdit) {
      montaOsChecksDoLote(lote!);
    }
  }, [lote]);

  /* useEffect(() => {
        console.log('useEffect PEDIDOSSSSS ', pedidosPendente);
    }, [pedidosPendente]); */ 


  function montaOsChecksDoLote(lote: Lote) {
    console.log('LoteAdd - montaOsChecksDoLote');
    const arrayPedidosPendentes: Pedido[] = pedidosPendente;
    let lotesParaToggle: number[] = [];
    for (const umPedido of lote.pedidos) { 
      const newPedido = pedidos?.find(e => e.id === umPedido.pedido_id);
      //toggleSwitch(true, umPedido.pedido_id);
      lotesParaToggle.push(umPedido.pedido_id);
      arrayPedidosPendentes.push(newPedido!);
      /* console.log('ANTES setPedidosPendetes ', newPedido?.id);
            if (newPedido?.id === 7 || newPedido?.id === 8) {
                console.log('IDDDDDDDD: ', newPedido?.id)
                setPedidosPendente([ ...pedidosPendente!, newPedido!])
            } */
    }
    setPedidosPendente(arrayPedidosPendentes);
    toggleSwitchArray(true, lotesParaToggle);
  }

  /* async function loadPedidosApi() {
        console.log('LoteAdd - loadPedidos');
        if (spinner) {
            return;
        }
        if (totalRow > 0 && pedidos.length == totalRow) {
            return;
        }
        setSpinner(true);
        const response = await api.get('pedidos', { params: { page, status: 1 } });
        setPedidos([ ...pedidos, ...response.data]); 
        setTotalRow(response.headers['x-total-count']);
        //setPage(page + 1);
        setSpinner(false);
    } */

  /* const toggleSwitch = (value, idPedido) => { 
        console.log(value, idPedido);
        setIsEnabled(previousState => !previousState);

    } */

  function toggleSwitch(value: boolean, idPedido: number) {
    const newArray = listaCheckPedidos.filter(el => el.idPedido != idPedido);
    newArray.push({idPedido: idPedido, check: value});
    setListaCheckPedidos(newArray);
    if (value) {
      setArrayComIdPedidos([...arrayComIdPedidos, { pedido_id: idPedido }]);
    } else {
      const newArrayComIdPedidos = arrayComIdPedidos.filter(el => el.pedido_id != idPedido);
      setArrayComIdPedidos(newArrayComIdPedidos);
    }
    console.log('LoteAdd - ArrayComIdPedidos: ', arrayComIdPedidos);
    //setIsEnabled(previousState => !previousState);
  }

  function toggleSwitchArray(value: boolean, arrayIdPedido: number[]) {
    let newArray: CheckPedidos[] = listaCheckPedidos;
    let newArrayComIdPedidos: IdPedido[] = arrayComIdPedidos;
    for (const item of arrayIdPedido) {
      newArray = newArray.filter(el => el.idPedido != item);
      newArray.push({idPedido: item, check: value});
      if (value) {
        newArrayComIdPedidos.push({ pedido_id: item });
        //newArrayComIdPedidos = arrayComIdPedidos.filter(el => el.pedido_id != item);
      } else {
        const auxArrayComIdPedidos = newArrayComIdPedidos.filter(el => el.pedido_id != item);
        newArrayComIdPedidos = auxArrayComIdPedidos;
      }
    }
    setListaCheckPedidos(newArray!);
    setArrayComIdPedidos(newArrayComIdPedidos);
  }
    
  function getIsEnabled(idPedido: number) {
    const umCheckPedido = listaCheckPedidos.find( (e => e.idPedido === idPedido), idPedido);
    return umCheckPedido && umCheckPedido.check;
  }

  function onShowButton() {
    console.log('LoteAdd - Tamanho lista arrayComIdPedidos: ', arrayComIdPedidos.length);
    if (arrayComIdPedidos.length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }


  async function createLote() {
    if (listaCheckPedidos.length === 0) {
      alert.alertErro('Selecione ao menos um pedido!!!');
      return;
    }
    //const newListaPedidos = [];
    /* listaCheckPedidos.forEach(el => {
            if (el.check) {
                arrayComCheckPedidos.push(el.idPedido);
            }
        }); */

    const umLote = { 
      id: lote?.id,
      dt_lote: dateNow,
      pedidos: arrayComIdPedidos,
      status_id: 1,
      observacao: '',
      //ehUpdate: false,
    };

    if (ehEdit) {
      //umLote.ehUpdate = true;
      try {
        setSpinner(true);
        const response = await api.put('lotes/' + lote?.id, umLote);
        if (response.status === 200) {
          alert.alertOk('Lote alterado!');
          navigation.navigate('LoteList', { umLote, ehEdit });
          const usuarioLogado = await storageUsuario.getUsuario();
          loadDataPedidoApi(usuarioLogado.fl_admin, usuarioLogado.id);
          setSpinner(false);
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    } else {
      try {
        setSpinner(true);
        const response = await api.post('lotes', umLote);
        if (response.status === 201) {
          alert.alertOk('Lote criado!');
          umLote.id = response.data.id;
          navigation.navigate('LoteList', { umLote, ehEdit });
          setSpinner(false);
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    }

    console.log(umLote);
    navigation.navigate('LoteList', { umLote });
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.viewTextLote}>
          {ehEdit && <Text style={styles.textLote}>Lote N° {lote?.id} </Text> }
        </View>
        <FlatList data={pedidosPendente} 
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => 
            <View style={styles.line}>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  //thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  thumbColor="#f5dd4b"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => toggleSwitch(value, item.id!)}
                  value={getIsEnabled(item.id!)}
                />
              </View>
              <View style={styles.descricaoContainer}>
                <Text style={styles.description}>
                                    Pedido: {item.id}
                </Text>
                <Text style={styles.date}>
                  {/* {moment(item.dt_pedido).format('DD/MM/YYYY')} - {item.nomeVendedor} */}
                  {item.dt_pedido} - {item.nomeVendedor}
                </Text>
                <Text style={styles.cliente}>
                  {item.nomeCliente}
                </Text>
              </View> 
            </View> 
          }
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={createLote}
        style={styles.TouchableOpacityStyle}>
        {/* <Icon name='plus-square' size={30} color={commonStyles.colors.white} /> */}
        <Icon name='floppy-o' size={30} color={commonStyles.colors.white} />
      </TouchableOpacity>
      {/* <View style={styles.viewButton}>
                <TouchableOpacity style={{ padding: 10 }} 
                    disabled={!showButton} 
                    onPress={createLote}>
                    <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
                        <Text style={styles.buttonText}>{ehEdit ? 'Alterar Lote' : 'Criar Lote'}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}

    </View>
        
  );
   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  /* separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
    }, */
  /* title: {
        // fontFamily: any,
        color: '#334455',
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    }, */
  /* titleBar: {
        flex: 2,
        justifyContent: 'flex-end',
    }, */
  body: {
    //flex: 1,
    flexDirection: 'column',
    width: '100%',
    //backgroundColor: "pink",
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    //backgroundColor: 'red'
  },
  viewTextLote: {
    alignItems: 'center',
    backgroundColor: commonStyles.colors.maonamassa1
  },
  textLote: {  
    fontSize: 25,
    marginBottom: 5,
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //width: '20%',
    //backgroundColor: 'yellow'
  },
  descricaoContainer: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //width: '80%',
    //backgroundColor: 'olive'
  },
  description: {
    // color: commonStyles.colors.tipo1,
    color: 'black',
    fontSize: 25,
  },
  date: {
    // color: commonStyles.colors.tipo2,
    color: 'red',
    fontSize: 20,
  },
  cliente: {
    //color: commonStyles.colors.tipo2,
    color: 'black',
    fontSize: 25,
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: commonStyles.colors.maonamassa2,
    borderRadius: 30,
  },
  /* viewButton: {
        //flex: 1,
        width: '100%',
        height: 55,
    }, */
  /* button: {
        backgroundColor: '#00F',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
    }, */
  /* buttonText: {
        //fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 23
    }, */

});

export default LoteAdd;
