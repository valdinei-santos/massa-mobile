import React, { useState, useEffect, useReducer } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, Text, View, Alert, PermissionsAndroid, Dimensions, Platform } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { RectButton, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
//import Pdf from 'react-native-pdf';
import FileViewer from 'react-native-file-viewer';

import api from '../../services/api';
import * as storage from '../../services/storage';
import { Lote } from 'src/interfaces/Lote';
import { Pedido } from 'src/interfaces/Pedido.ts';
import { LotePedido } from 'src/interfaces/LotePedido';
import { Produto } from 'src/interfaces/Produto';
import { PedidoItem } from 'src/interfaces/PedidoItem';
import geraHtml from './LoteHtml'

type ParamList = {
  LoteShow: {
    lote: Lote;
  };
};

//export default function LoteShow() {
const LoteShow: React.FC = () => {  
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LoteShow'>>();
  //const [lote, setLote] = useState({});
  const [lote, setLote] = useState<Lote>({} as Lote);
  const [descStatus, setDescStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  //const [showProdutoAdd, setShowProdutoAdd] = useState(false);
  //const [_count, forceUpdate] = useReducer(x => x + 1, 0);
  const [listaPedidos, setListaPedidos] = useState<Pedido[]>([]);
  const [listaPedidosString, setListaPedidosString] = useState('');
  const [listaPedidosAPI, setListaPedidosAPI] = useState<number[]>([]);
  const [listaProdutos, setListaProdutos] = useState<PedidoItem[]>([]);

  /* useLayoutEffect(() => {
        console.log('useLayoutEffect LoteShow');
        if (route.params?.lote) {
            setLote(route.params?.lote);
            console.log('lote show', lote);
        }
    }, [route.params?.lote]); */
    
  useEffect(() => {
    console.log('LoteShow - useEffect INIT');
    // Usado para limpar page quando estiver saindo
    return function cleanup() {
      console.log('RETURN useEffect');
    };
  }, []);

  useEffect(() => {
    console.log('LoteShow - useEffect route.params?.lote');
    if (route.params?.lote) {
      console.log('LoteShow - useEffect route.params?.lote - Entrou');
      setLote(route.params?.lote);
      getStatus(route.params?.lote.status_id);
      getListaPedidos(route.params?.lote);
      //if (listaPedidos.length > 0) 
      //loadProdutos();
            
      //getListaPedidosString(route.params?.lote);
            
      //getProdutos(route.params?.lote);
      //console.log('LoteShow - useEffect lote veio parametro', lote);
    }
  }, [route.params?.lote]);

  /* useEffect(() => {
        console.log('LoteShow - useEffect lote com parametro pedidos');
        if (route.params?.pedidos) {
            setListaPedidos(route.params?.pedidos);
        }
    }, [route.params?.pedidos]); */

  useEffect(() => {
    console.log('LoteShow - useEffect lote ');
        
  }, [lote]);

  useEffect(() => {
    console.log('LoteShow - useEffect listaPedidos ');
    if (listaPedidos.length > 0) {
      console.log('LoteShow - useEffect listaPedidos - Entrou');
      loadProdutos();
    }
  }, [listaPedidosAPI]);

  useEffect(() => {
    console.log('LoteShow - useEffect listaProdutos');
    if (listaProdutos.length > 0) {
      console.log('LoteShow - useEffect listaProdutos - Entrou');
      getTotal();
    }
  }, [listaProdutos])

  function askPermission() {
    //var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          { title: 'CameraExample App External Storage Write Permission',
            message: 'CameraExample App needs access to Storage data in your SD Card ',
            buttonPositive: ''
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          //changing the state to show Create PDF option
          createPDF();
        } else {
          Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      createPDF();
    }
  }

  async function createPDF() {
    console.log('PedidoShow - createPDF');
    let options = {
      //html: '<h1>PDF TEST</h1>',
      html: geraHtml(lote, descStatus, total, listaPedidosString, listaProdutos),
      fileName: 'Lote-' + lote.id,
      //directory: 'Documents',
      directory: 'Download',
    };
    
    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    FileViewer.open(file.filePath!)
      .then(() => {
        //Can do anything you want after opening the file successfully
        console.log('Success');
      })
      .catch(err => {
        //Handle failure here
        console.log(err);
      });
  }


  // Para carregar os dados da API
  async function loadProdutos() {
    console.log('LoteShow - loadProdutos');
    if (loading) {
      return;
    }
    const response = await api.get('pedidos/lista/produtos', { params: { listaPedidos: listaPedidosAPI } });
    setListaProdutos(response.data);
    setLoading(false);
  }

  async function getListaPedidos(umLote: Lote) {
    console.log('LoteShow - getListaPedidos');
    //let listaStringPedidos = null;
    let listaPedidos: Pedido[] = [];
    let listaPedString: string = '';
    let listaIdPedidos: number[] = [];
    let umPedido: Pedido;
    const promise = umLote.pedidos.map(async (item, idx) => {
      listaIdPedidos.push(item.pedido_id);
      //setListaPedidosAPI([...listaPedidosAPI, item.pedido_id]);
      umPedido = await storage.findPedido(item.pedido_id)
      //listaPedidos.push({ pedido_id: item.pedido_id });
      //listaPedidos.push(umPedido);
      setListaPedidos([...listaPedidos, umPedido]);
      if (idx === 0)
        listaPedString = String(item.pedido_id);
      else
        listaPedString = listaPedString + ', ' + String(item.pedido_id);
      setListaPedidosString(listaPedString);
    });
    await Promise.all(promise);
    setListaPedidosAPI(listaIdPedidos);
    //setListaPedidos(listaPedidos);
    // getListaPedidoString
    //let listaPedidosString: string = '';
    /* listaPedidos.map((item, idx) => {
            if (idx === 0)
                listaPedidosString = String(item.id);
            else
                listaPedidosString = listaPedidosString + ', ' + String(item.id);
        });
        setListaPedidosString(listaPedidosString); */
  }

  /* function getListaPedidosString(umLote: Lote) {
        console.log('LoteShow - getListaPedidosString');
        let listaPedidosString: string = '';
        listaPedidos && listaPedidos.map((item, idx) => {
            if (idx === 0)
                listaPedidosString = String(item.id);
            else
                listaPedidosString = listaPedidosString + ', ' + String(item.id);
        });
        setListaPedidosString(listaPedidosString);
    } */

  function getTotal() {
    console.log('LoteShow - getTotal');
    let total = 0;
    if (listaProdutos) {
      listaProdutos.forEach((v, i, a) => {
        //console.log('LoteShow TOT', v.total);
        total = total + Number(v.qtd * (v.preco_unidade * v.qtd_embalagem));
      });
    }
    //console.log('SET TOT', total);
    setTotal(total);
  }

  function getStatus(status: number) {
    console.log('LoteShow - getStatus');
    switch (status) {
      case 1: 
        setDescStatus('Pendente');
        break;
      case 2: 
        setDescStatus('Alocado');
        break;
      case 3: 
        setDescStatus('Preparado');
        break;
      case 4: 
        setDescStatus('Entregue');
        break;
      default:
        setDescStatus('Pendente');
        break;
    }
  }


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.textLote}>
                  Lote: <Text style={styles.textLote2}>{ lote.id } </Text> 
        </Text>
        <Text style={styles.textLote}>
                  Status: <Text style={styles.textLote2}>{ lote.status_id } - {descStatus} </Text> 
        </Text>
        <Text style={styles.textLote}> 
                  Data: <Text style={styles.textLote2}> {lote.dt_lote} </Text>
          {/* Data: <Text style={styles.textLote2}> {moment(lote.dt_lote).format('DD/MM/YYYY')} </Text> */}
        </Text>
        <Text style={styles.textLote}>
                  Total: <Text style={styles.textLote2}>{ total.toFixed(2).replace('.',',') }</Text>
          {/* Total: <Text style={styles.textLote2}>{ total }</Text> */}
        </Text>
        <Text style={styles.textLote}>
                  Pedidos: <Text style={styles.textLote2}> { listaPedidosString } </Text>
        </Text>
          
        <View style={styles.listProductsRow}>
          <Text style={styles.textProdutos}>
                      Produtos: 
          </Text>
          {   
            listaProdutos && listaProdutos.map( (v: PedidoItem) => {
              return (
                <View key={v.id}>
                  <View  style={styles.listProductsRow2}>
                    <Text style={styles.listProductsQtd}>
                      {v.qtd}
                    </Text>
                    <Text style={styles.listProductsText}>
                      {v.nome} {v.sabor} - {v.peso} - 
                      <Text style={styles.colorRed}>R$ {(v.qtd * (v.qtd_embalagem * v.preco_unidade)).toFixed(2).replace('.',',')}</Text>
                    </Text>
                  </View> 
                </View>
              )
            }) 
          }
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity style={{ padding: 10 }} onPress={askPermission}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Criar PDF</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.viewButton}>
          <RectButton style={styles.buttonRect} onPress={askPermission}>
            <View style={styles.buttonRectIcon}>
              <Text>
                <Icon name='arrow-right' size={30} color='#FFF' />
              </Text>
            </View>
            <Text style={styles.buttonRectText}>
                          Criar PDF
            </Text>
          </RectButton>
        </View> */}
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
    backgroundColor: "#F5FCFF",
    // backgroundColor: "red",
  },
  scrollView: {
    //
  },
  textLote: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textLote2: {
    fontWeight: 'normal',
  },
  textProdutos: {
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  listProductsRow: {
    flexDirection: 'column',
    // justifyContent: 'center', 
    alignItems: 'flex-start',
    width: '100%',
    marginLeft: 0,
    //backgroundColor: "red",
  },
  listProductsRow2: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'flex-start',
    //width: '100%',
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
    //backgroundColor: 'yellow'
  },
  listProductsText: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '90%',
    //backgroundColor: 'blue'
  },
  colorRed: {
    color: 'red'
  }, 
  separador: {
    borderTopWidth: 1,
    //backgroundColor: 'pink'
  },
  viewButton: {
    width: '100%',
    //height: 55,
  },
  button: {
    backgroundColor: '#00F',
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 23,
  },
  /* buttonRect: {
    backgroundColor: '#00F', //'#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonRectIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonRectText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 23,
  }, */

  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  }
  /* viewButton: {
        width: '100%',
        height: 55,
    }, */
  /* button: {
        backgroundColor: '#00F',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 23
    }, */
  /* viewTotal: {
        padding: 5,
    }, */
  /* date: {
        // fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
    },
    separator: {
        // height: 10,
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }, */

});

export default LoteShow;
