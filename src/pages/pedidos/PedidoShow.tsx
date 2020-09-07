import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, Text, View, Linking, Alert, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

//import { RNHTMLtoPDF } from 'react-native-html-to-pdf'

import moment from 'moment';
import 'moment/locale/pt-br';

import { Pedido } from 'src/interfaces/Pedido';
import geraHtml from './PedidoHtml'

type ParamList = {
  PedidoShow: {
    pedido: Pedido;
  };
};

//export default function PedidoShow() {
const PedidoShow: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PedidoShow'>>();
  //const [pedido, setPedido] = useState({});
  const [pedido, setPedido] = useState({} as Pedido);
  const [descStatus, setDescStatus] = useState('');
  const [total, setTotal] = useState(0);
  let source: any;

  /* useLayoutEffect(() => {
        console.log('useLayoutEffect PedidoShow');
        if (route.params?.pedido) {
            setPedido(route.params?.pedido);
            console.log('pedido show', pedido);
        }
    }, [route.params?.pedido]); */

  useEffect(() => {
    console.log('PedidoShow - useEffect params?.pedido');
    if (route.params?.pedido) {
      setPedido(route.params?.pedido);
      getStatus(route.params?.pedido.status_id);
      console.log('PedidoShow - useEffect - pedido veio params ', route.params?.pedido);
    }
  }, [route.params?.pedido]);

  useEffect(() => {
    console.log('PedidoShow - useEffect pedido');
    console.log('pedido ', pedido);
    getTotal();
    getStatus(pedido.status_id);
  }, [pedido]);

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
      html: geraHtml(pedido, descStatus, total),
      fileName: 'Pedido-' + pedido.id,
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

  function getTotal() {
    let total = 0;
    if (pedido.itens) {
      pedido.itens.forEach((v, i, a) => {
        total = total + (v.qtd * (v.qtd_embalagem * v.preco_unidade));
      });
    }
    setTotal(total);
  }

  function getStatus(status_id: number) {
    switch (status_id) {
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

  /* function useAsyncState(initialValue) {
        const [value, setValue] = useState(initialValue);
        const setter = x =>
          new Promise(resolve => {
            setValue(x);
            resolve(x);
          });
        return [value, setter];
      }

      async function setPedidoAsync() {
        const newCount = await setPedido(count + 1)
        setMessage(`count is ${newCount}`);
      } */

  function enviaWhatapp() {
    const msg = 'Mensagem que vai no whatsapp';
    const nrTelefoneWhatsapp = '48999448383';
    Linking.openURL(`whatsapp://send?phone${nrTelefoneWhatsapp}&text=${msg}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.textPedido}>
                  Pedido: <Text style={styles.textPedido2}>{ pedido.id } </Text> 
        </Text>
        <Text style={styles.textPedido}>
                  Status: <Text style={styles.textPedido2}>{ pedido.status_id } - {descStatus} </Text> 
        </Text>
        <Text style={styles.textPedido}>
                  Cliente: <Text style={styles.textPedido2}>{ pedido.nomeCliente }  </Text>
        </Text>
        <Text style={styles.textPedido}>
                  Vendedor: <Text style={styles.textPedido2}>{ pedido.nomeVendedor }  </Text>
        </Text>
        <Text style={styles.textPedido}> 
                  Data: <Text style={styles.textPedido2}> 
            {/* {moment(pedido.dt_pedido).format('DD/MM/YYYY')} </Text> */}
            {pedido.dt_pedido} </Text>
        </Text>
        <Text style={styles.textPedido}>
                  Total: <Text style={styles.textPedido2}>{ total.toFixed(2).replace('.',',') }</Text>
        </Text>
          
        <View style={styles.listProductsRow}>
          <Text style={styles.textProdutos}>
                      Produtos: 
          </Text>
          {
            pedido.itens && pedido.itens.map( (v) => {
              return (
                <View key={v.id}>
                  <View  style={styles.listProductsRow2}>
                    <Text style={styles.listProductsQtd}>
                      {v.qtd}
                    </Text>
                    <Text style={styles.listProductsText}>
                      {v.nome} {v.sabor} - {v.peso} - 
                      <Text style={styles.colorRed}> R$ {(v.qtd * (v.qtd_embalagem * v.preco_unidade)).toFixed(2).replace('.',',')}</Text>
                    </Text>
                  </View> 
                  {/* <Text style={styles.separador}></Text> */}
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
    //backgroundColor: "#F5FCFF",
    // backgroundColor: "red",
  },
  scrollView: {
    //
  },
  textPedido: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textPedido2: {
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

export default PedidoShow;
  