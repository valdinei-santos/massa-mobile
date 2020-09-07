import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button,
  Keyboard, 
  FlatList,
  ScrollView} from 'react-native';
import { Picker } from '@react-native-community/picker';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
import Divider from 'react-native-divider';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';;
import * as alert from '../../components/shared/AlertCustom';

import api from '../../services/api';
import { getDataUsuario } from '../../services/storage-usuario';
import * as storage from '../../services/storage';
//import { Produto } from 'src/interfaces/Produto';
import { Pedido } from 'src/interfaces/Pedido';
import { Cliente } from 'src/interfaces/Cliente';
import { PedidoItem } from 'src/interfaces/PedidoItem';
//import { PedidoItemBD } from 'src/interfaces/PedidoItemBD';
import { Usuario } from 'src/interfaces/Usuario';
//import { PedidoItemBD } from 'src/interfaces/PedidoItemBD';
//import { PedidoItemView } from 'src/interfaces/PedidoItemView';
//import { PedidoView } from 'src/interfaces/PedidoView.ts.old';
import { useLote } from '../../contexts/loteContext';



/* type PedidoComNomeCliente = {
    nomeCliente: string;
} & Pedido */

/* type Props = {
    onPress: (event: GestureResponderEvent) => void;
} */

type ParamList = {
  PedidoAdd: {
    pedido: Pedido;
    searchCliente: Cliente;
    //searchCliente: () => void;
    searchProduto: PedidoItem;
    //ehSearch: boolean;
    //ehEdit: boolean;
  };
};


//export default function PedidoAdd() {
const PedidoAdd: React.FC = () => { 
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PedidoAdd'>>();
  const [user, setUsuario] = useState<Usuario>({} as Usuario);
  const [idPedido, setIdPedido] = useState(0);
  const [pedido, setPedido] = useState<Pedido>({} as Pedido);
  const [cliente, setCliente] = useState({});
  const [idCliente, setIdCliente] = useState<number | undefined>(0);
  const [nomeCliente, setNomeCliente] = useState<string| undefined>('');
  //const [vendedor, setVendedor] = useState({});
  //const [idVendedor, setIdVendedor] = useState(0);
  //const [nomeVendedor, setNomeVendedor] = useState('');
  const [produto, setProduto] = useState<PedidoItem>({} as PedidoItem);
  const [produtos, setProdutos] = useState<PedidoItem[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [qtdProduto, setQtdProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [qtd, setQtd] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(1);
  const [listaProdutos, setListaProdutos] = useState<PedidoItem[]>([]);
  //const [listaProdutosBD, setListaProdutosBD] = useState<PedidoItemBD[]>([]);
  const [dateNow, setDateNow] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [showButton, setShowButton] = useState(false);
  const [ehEdit, setEhEdit] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const { lotes, setNewStateLotes } = useLote();
  const { existPedidoNoLote } = useLote();

  useEffect(() => {
    console.log('useEffect PedidoAdd init');
    //loadProdutos();
    getDadosUsuario();
    //<Button onPress={() => createPedido()} title="Test" /> 
    /* navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={createPedido}
                    style={styles.TouchableOpacityStyle}>
                    <Icon name='floppy-o' size={30} color={commonStyles.colors.white} />
                </TouchableOpacity> 
            ),
          }); */
  }, []);

  useEffect(() => {
    console.log('useEffect PedidoAdd');
    if (route.params?.pedido) {
      console.log('useEffect Pedido: ', route.params?.pedido);
      let umPedido: Pedido = {
        id: Number(route.params?.pedido.id),
        dt_pedido: route.params?.pedido.dt_pedido,
        status_id: route.params?.pedido.status_id,
        pago: route.params?.pedido.pago,
        observacao: route.params?.pedido.observacao,
        cliente_id: route.params?.pedido.cliente_id,
        user_id: route.params?.pedido.user_id,
        itens: route.params?.pedido.itens,
      };
      setPedido(umPedido);
      setStatus(umPedido.status_id);
      console.log('VEIO COMO', umPedido)
      setIdCliente(route.params?.pedido.cliente_id);
      //setIdVendedor(route.params?.pedido.vendedor_id);
      montaPedidoNaTela(route.params?.pedido);
      setEhEdit(true);
      navigation.setOptions({title: 'Alteração Pedido'});
    }
  }, [route.params?.pedido]);

  useEffect(() => {
    console.log('useEffect PedidoAdd listaProdutos');
    getTotal();
    onShowButton();
  }, [listaProdutos]);
    
  useEffect(() => {
    console.log('useEffect PedidoAdd showButton');
  }, [showButton]);

  useEffect(() => {
    console.log('useEffect PedidoAdd total');
  }, [total]);

  /* useEffect(() => {
        console.log('useEffect PedidoAdd umCliente');
        if (route.params?.umCliente) {
            if (route.params?.umCliente.id) {
                updateCliente(route.params?.umCliente);
            } else {
                saveCliente(route.params?.umCliente);
            }
        }
    }, [route.params?.umCliente]); */

  useEffect(() => {
    console.log('useEffect PedidoAdd searchCliente', route.params?.searchCliente);
    if (route.params?.searchCliente) {
      setNomeCliente(route.params?.searchCliente.nome);
      setIdCliente(route.params?.searchCliente.id);
      setCliente(route.params?.searchCliente);
    }
  }, [route.params?.searchCliente]);

  /* useEffect(() => {
        console.log('useEffect PedidoAdd searchVendedor', route.params?.searchVendedor);
        if (route.params?.searchVendedor) {
            setNomeVendedor(route.params?.searchVendedor.nome);
            setIdVendedor(route.params?.searchVendedor.id)
            setVendedor(route.params?.searchVendedor);
        }
    }, [route.params?.searchVendedor]); */

  useEffect(() => {
    console.log('useEffect PedidoAdd searchProduto', route.params?.searchProduto);
    if (route.params?.searchProduto) {
      console.log('Veio do Produto');
      setNomeProduto(route.params?.searchProduto.nome + ' ' +
                           route.params?.searchProduto.sabor + ' ' +
                           route.params?.searchProduto.peso);

      console.log(route.params?.searchProduto.preco_unidade * route.params?.searchProduto.qtd_embalagem);
      setPrecoProduto(String((route.params?.searchProduto.preco_unidade * 
                                   route.params?.searchProduto.qtd_embalagem).toFixed(2)).replace('.',',') );
            
      let umProduto: PedidoItem = {
        id: route.params?.searchProduto.id,
        nome: route.params?.searchProduto.nome,
        sabor: route.params?.searchProduto.sabor,
        peso: route.params?.searchProduto.peso,
        preco_unidade: route.params?.searchProduto.preco_unidade,
        qtd_embalagem: route.params?.searchProduto.qtd_embalagem,
        qtd: 0,
      };
      setProduto(umProduto);
    }
  }, [route.params?.searchProduto]);

  function getStatus(status_id: number) {
    switch (status_id) {
      case 1: return 'Pendente';
      case 2: return 'Alocado';
      case 3: return 'Preparado';
      case 4: return 'Entregue';
      default: return 'Pendente';
    }
  }
    

  async function getDadosUsuario() {
    setUsuario(await getDataUsuario());
    /* getUsuario() 
            .then((res) => setUsuario(JSON.parse(res)) )
            .catch((err) => console.error(err) );  */
  }

  function montaPedidoNaTela(pedido: Pedido) {
    console.log('montaPedidoNaTela');
    setIdCliente(pedido.cliente_id);
    setNomeCliente(pedido.nomeCliente);
    /* if ('produto_id' in pedido.itens) {
            setListaProdutosBD(pedido.itens);
        } else {
            setListaProdutos(pedido.itens);
        } */
    console.log('VAL', pedido.itens)
    setListaProdutos(pedido.itens);
  }

  /* async function loadProdutos() {
        console.log('PedidoAdd - loadProdutos');
        if (spinner) {
            return;
        }
        setSpinner(true);
        const response = await api.get('produtos', { params: { page } });
        setSpinner(false);
        setProdutos([ ...produtos, ...response.data]); // Esta anexando 2 array em 1
        setTotalRow(response.headers['X-Total-Count']);
        setPage(page + 1);
        setLoading(false);
    } */
  /* componentDidMount = async () => {
        console.log('PedidoAdd DidMount');
        this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
            // Update the component (API calls here)
            console.log('PedidoAdd DidMount2222');
            console.log(payload);
          });
    } */

  function getTotal() {
    let total = 0;
    listaProdutos.forEach((value: PedidoItem) => {
      total = total + (value.qtd * (value.qtd_embalagem * value.preco_unidade));
    });
    setTotal(total);
  }
  function onShowButton() {
    console.log(listaProdutos.length);
    if (listaProdutos.length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }
    
  function addProduct() {
    console.log('ADDD')
    Keyboard.dismiss();
    let exist = false;
    listaProdutos.forEach((el: PedidoItem) => {
      if (el.id === produto.id) {
        exist = true;
        return;
      }
      /* if ('produto_id' in el) {
                if (el.produto_id === produto.id) {
                    exist = true;
                    return;
                }
            } else {
                if (el.id === produto.id) {
                    exist = true;
                    return;
                }
            } */
    }, produto.id);
    if (exist) {
      alert.alertErro('Produto já adicionado!!!');
      return;
    }
    if (Number(qtdProduto) <= 0) {
      alert.alertErro('Qtd deve ser maior que 0!!!');
      return;
    }
    /* const newProduto = produtos.find((el) => {
            return el.id === id
        }, id); */
    const newProduto = produto;
    newProduto.qtd = Number(qtdProduto);
    //newProduto.produto_id = newProduto.id;
    //delete newProduto.id;
    setListaProdutos([...listaProdutos, newProduto]);
    setNomeProduto('');
    setPrecoProduto('');
    setQtdProduto('');
    //setSelectedLabel(1);
    //setSelectedItem(1);
    //setQtd(1);
  }

  function pickerChange(value: number) {
    console.log('pickerChange ', value);
    if (existPedidoNoLote(pedido.id!)) {
      if (value === 1) {
        alert.alertErro('Pedido já está alocado em algum Lote. ' +
                        'Não pode voltar a ser pendente');
      } else {
        setStatus(value);
      } 
    } else {
      setStatus(value);
    }
    /* storage.existPedidoNoLote(pedido.id!)
      .then(res => {
        if (res) {
          if (value === 1) {
            alert.alertErro('Pedido já está alocado em algum Lote. ' +
                                        'Não pode voltar a ser pendente');
          } else {
            setStatus(value);
          }
        } else {
          setStatus(value);
        }
      }); */
        
  }

  function removeProduct(id: number) {
    console.log('PedidoAdd - removeProduct', id);
    console.log('LISTA', listaProdutos);
    if (id !== undefined && id !== null) {
      const newArray = listaProdutos.filter((el) => {
        return el.id != id
      }, id);
      //console.log(newArray);
      setListaProdutos(newArray);
    } else {
      alert.alertErro('ID do item não encontrado.');
    }
  }
    
  function searchCliente() {
    console.log('PedidoAdd - searchCliente');
    navigation.navigate('ClienteList', { ehSearch: true });
  }

  /* function searchVendedor(id) {
        console.log('searchVendedor');
        navigation.navigate('VendedorList', { ehSearch: true });
    } */

  function searchProduto() {
    console.log('PedidoAdd - searchProduto');
    navigation.navigate('ProdutoList', { ehSearch: true });
  }


  async function createPedido() {
    if (!nomeCliente) {
      alert.alertErro('Informe o Cliente!!!');
      return;
    }
    const listaProdutosBD = listaProdutos.map( (v) => {
      return {
        qtd: v.qtd,
        produto_id: v.id,
        qtd_embalagem: v.qtd_embalagem,
        preco_unidade: v.preco_unidade
      };
    });
    const umPedidoView: Pedido = { 
      id: pedido.id,
      cliente_id: Number(idCliente),
      nomeCliente: nomeCliente,
      user_id: user.id,
      nomeVendedor: user.nome, //nomeVendedor,
      dt_pedido: dateNow,
      itens: listaProdutos,
      status_id: status,
      observacao: '',
      pago: 0,
      //ehUpdate: false,
    }
    const umPedido: any = {...umPedidoView}; // Cópia do Pedido
    delete umPedido.nomeCliente;
    delete umPedido.nomeVendedor;        
    delete umPedido.itens;
    //console.log('LISTABD', listaProdutosBD)
    umPedido.itens = listaProdutosBD;

    if (ehEdit) {
      //umPedido.ehUpdate = true;
      console.log('UPDATE ', umPedido);
      console.log('UPDATE-VIEW ', umPedidoView);
      try {
        setSpinner(true);
        const response = await api.put('pedidos/' + pedido.id, umPedido);
        //console.log('PEDIDO UP: ', umPedido);
        setSpinner(false);
        if (response.status === 200) {
          alert.alertOk('Pedido alterado!');
          navigation.navigate('PedidoList', { umPedido: umPedidoView, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    } else {
      console.log('INSERT ', umPedido);
      try {
        setSpinner(true);
        const response = await api.post('pedidos', umPedido);
        setSpinner(false);
        if (response.status === 201) {
          alert.alertOk('Pedido criado!');
          umPedidoView.id = response.data.id;
          navigation.navigate('PedidoList', { umPedido: umPedidoView, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    }

  }


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.viewInputCliente}>
          <TextInput placeholder='Cliente' style={styles.clienteInput}
            editable={false}
            onChangeText={nomeCliente => setNomeCliente(nomeCliente)}
            value={nomeCliente} />
          <TouchableOpacity 
            onPress={() => searchCliente() } >
            <Icon name="search" size={38} color="blue" style={styles.clienteInputIcone} />
          </TouchableOpacity>
                  
        </View>
        {/* <View style={styles.viewInputCliente}>
                  <TextInput placeholder='Vendedor' style={styles.clienteInput}
                      onChangeText={nomeVendedor => setNomeVendedor(nomeVendedor)}
                      value={nomeVendedor} />
                  <TouchableOpacity 
                      onPress={searchVendedor} >
                      <Icon name="search" size={38} color="blue" style={styles.clienteInputIcone} />
                  </TouchableOpacity>
                  
              </View> */}
        <View style={styles.viewInputCliente}>
          <TextInput placeholder='Produto' style={styles.clienteInput}
            editable={false}
            onChangeText={nomeProduto => setNomeProduto(nomeProduto)}
            value={nomeProduto} />
          <TouchableOpacity 
            onPress={() => searchProduto() } >
            <Icon name="search" size={38} color="blue" style={styles.clienteInputIcone} />
          </TouchableOpacity>
        </View>
        <View style={styles.productRow}>
          <TextInput placeholder='Qtd' placeholderTextColor='black' style={styles.productInput2}
            keyboardType='numeric'
            //autoFocus={true}
            onChangeText={qtdProduto => setQtdProduto(qtdProduto)}
            value={qtdProduto} />
          <TextInput placeholder='Preço' style={styles.productInput2}
            editable={false}
            keyboardType='decimal-pad'
            onChangeText={precoProduto => setPrecoProduto(precoProduto)}
            value={precoProduto} />
          <TouchableOpacity style={styles.productButton}
            onPress={() => addProduct()}>
            <Icon name='plus-circle' size={40} color='blue' />
          </TouchableOpacity>
        </View>

        <View style={styles.productRow}>
                  
        </View>

        <View style={styles.productRow}>
          { user.fl_admin === 1 && 
                      <Text style={styles.textPicker}>Status: </Text>
          }
          { user.fl_admin === 1 && 
                      <Picker style={styles.productPicker}
                        //mode="dropdown"
                        prompt="Selecione Status:"
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) => {
                          pickerChange(Number(itemValue)) }
                        }>
                        <Picker.Item key={1} label={getStatus(1)} value={1} />
                        <Picker.Item key={2} label={getStatus(2)} value={2} />
                        <Picker.Item key={3} label={getStatus(3)} value={3} />
                        <Picker.Item key={4} label={getStatus(4)} value={4} /> 
                        {/* {
                              produtos && produtos.map( (v) => {
                                  return <Picker.Item key={v.id} 
                                          label={v.tipo + ' ' + v.sabor + ' - ' + v.peso + ' - R$ ' + 
                                                  (v.qtd_embalagem * v.preco_unidade).toFixed(2).replace('.',',')} 
                                          value={v.id} />
                              })
                          } */}
                      </Picker>
          } 
        </View>

        <Divider borderColor="#000" color="#000" orientation="left">Produtos</Divider>
              
        <View style={styles.listProductsRow}>
          {/* <FlatList 
            data={listaProdutos} 
            keyExtractor={item => `${item.id}`}
            renderItem={({ item }) => 
              <>
                <Text style={styles.listProductsQtd}>
                  {item.qtd}
                </Text>
                <Text style={styles.listProductsText}>
                  {item.nome} {item.sabor} - {item.peso} - R$ {(item.qtd * (item.qtd_embalagem * item.preco_unidade)).toFixed(2).replace('.',',')}
                </Text>
                <TouchableOpacity style={styles.listProductsButton}
                  onPress={() => removeProduct(item.id)}>
                  <Icon name='minus-circle' size={30} color='red' />
                </TouchableOpacity>    
              </>     
            }
          /> */}
          {
            listaProdutos && listaProdutos.map( (v: PedidoItem) => {
              return (
                <View key={v.id} style={styles.listProductsRow2}>
                  <Text style={styles.listProductsQtd}>
                    {v.qtd}
                  </Text>
                  <Text style={styles.listProductsText}>
                    {v.nome} {v.sabor} - {v.peso} - R$ {(v.qtd * (v.qtd_embalagem * v.preco_unidade)).toFixed(2).replace('.',',')}
                  </Text>
                  <TouchableOpacity style={styles.listProductsButton}
                    onPress={() => removeProduct(v.id)}>
                    <Icon name='minus-circle' size={30} color='red' />
                  </TouchableOpacity>
                </View> 
              )
            })
          }
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.listTotal}>
                      Total: { total.toFixed(2).replace('.',',') }
          </Text>
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity style={{ padding: 10 }} 
            disabled={!showButton} 
            onPress={createPedido}>
            <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
              <Text style={styles.buttonText}>{ehEdit ? 'Alterar Pedido' : 'Criar Pedido'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 3,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    //backgroundColor: "#F5FCFF",
    //backgroundColor: "red",
  },
  scrollView: {
    //backgroundColor: 'pink',
    //width: '100%',
    //minHeight: '100%',
    //marginHorizontal: 20,
  },
  viewInputCliente: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 55,
    paddingRight: 10,
    marginBottom: 10,
    //backgroundColor: 'green'
  },
  clienteInput: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '85%',
    height: 55,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 8,
  },
  clienteInputIcone: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  /* viewDatePicker: {
        marginTop: 10,
    }, */
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center'
  },
  productPicker: {
    flex: 1,
    height: 55, 
    marginLeft: 10,
    //width: '70%'
  },
  textPicker: {
    marginLeft: 10,
    fontSize: 20,
  },
  /* itemPicker: {
        fontSize: 25
    }, */
  /* productInput1: { // EXEMPLO PARA USO EM OUTROS LUGARES
        width: '15%',
        height: 55,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        //borderColor: '#e3e3e3',
        borderColor: '#000',
        borderRadius: 8,
    }, */
  productInput2: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '40%',
    height: 55,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 8,
  },
  productButton: {
    //height: 50, 
    width: '15%',
    alignItems: 'flex-end',
    paddingRight: 10
  },
  listProductsRow: {
    flexDirection: 'column',
    // justifyContent: 'center', 
    alignItems: 'flex-start',
    width: '100%',
    marginLeft: 0,
  },
  listProductsRow2: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'flex-start',
    //width: '80%',
    marginLeft: 1,
    marginBottom: 10,
    paddingBottom: 10,
    //marginTop: 5,
    borderBottomWidth: 1,
    //height: 60,
    //backgroundColor: 'green'
  },
  listProductsQtd: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    paddingLeft: 3,
    width: '10%',
    // backgroundColor: 'yellow'
  },
  listProductsText: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '80%',
    //marginLeft: 10,
    //backgroundColor: 'blue'
  },
  listProductsButton: {
    //height: 50, 
    width: '10%',
    alignItems: 'center',
  },
  viewButton: {
    width: '100%',
    //height: 55,
  },
  button: {
    backgroundColor: '#00F',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    //fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 23
  },
  viewTotal: {
    padding: 5,
    width: '100%',
    // backgroundColor: 'red'
  },
  listTotal: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 3,
    // backgroundColor: 'pink'
  },
  /* date: {
        // fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
    }, */
  /* separator: {
        // height: 10,
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }, */
});

export default PedidoAdd;
  