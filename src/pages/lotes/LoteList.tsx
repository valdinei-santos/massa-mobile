import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Platform, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../../commonStyles';
import LoteItem from '../../components/lotes/LoteItem';
//import AsyncStorage from '@react-native-community/async-storage';
import * as storage from '../../services/storage';
import * as alert from '../../components/shared/AlertCustom';
import { Lote } from 'src/interfaces/Lote';
import api from '../../services/api';
import { useLote } from '../../contexts/loteContext';

type ParamList = {
  LoteList: {
    umLote: Lote;
    ehSearch: boolean;
    ehEdit: boolean;
  };
};

//export default function LoteList()  {
const LoteList: React.FC = () => {    
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LoteList'>>();
  const { lotes, setNewStateLotes } = useLote();
  const [umLote, setUmLote] = useState({});
  //const [lotes, setLotes] = useState<Lote[]>([]);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('LoteList - useEffect INIT');
    //loadLotesApi();
    //loadLotesStorage();
  }, []);

  useEffect(() => {
    console.log('LoteList - useEffect route.params?.umLote');
    if (route.params?.umLote) {
      console.log('LoteList - Voltou com umLote');
      if (route.params?.ehEdit) {
        updateLote(route.params?.umLote);
      } else {
        saveLote(route.params?.umLote);
      }
    }
  }, [route.params?.umLote]);

  useEffect(() => {
    console.log('LoteList - useEffect lotes');
  }, [lotes]);

  /* async function loadLotesStorage() {
        setLotes(await storage.getLotes());
    } */

  // Para carregar os dados da API
  /* async function loadLotesApi() {
        console.log('LoteList - loadLotes');
        if (loading) {
            return;
        }
        if (totalRow > 0 && lotes.length == totalRow) {
            return;
        }
        try {
            setSpinner(true);
            //const response = await api.get('lotes', { params: { page } });
            const response = await api.get<Lote[]>('lotes', { params: { } });
            setSpinner(false);
            setLotes([ ...lotes, ...response.data]); // Esta anexando 2 array em 1
            setTotalRow(response.headers['x-total-count']);
            //setPage(page + 1);
            setSpinner(false);
        } catch (err) {
            setSpinner(false);
            alert.alertErroOps(err);
        }
    } */
    
  function getListaStringPedidos(umLote: Lote): string {
    let listaStringPedidos: string = '';
    umLote.pedidos.map((item, idx) => {
      if (idx === 0)
        listaStringPedidos = String(item.pedido_id);
      else
        listaStringPedidos = listaStringPedidos + ', ' + item.pedido_id;
    });
    return listaStringPedidos;
  }

  function sortArrayLotes(arrayUnsort: Lote[]) {
    // Para ordenar um campo só
    const arraySort = arrayUnsort.sort( (a, b) => { 
      let x = b.id;
      let y = a.id;
      if (x! < y!) {return -1;}
      if (x! > y!) {return 1;}
      return 0;
    });
    return arraySort;
  }

  function saveLote(data: Lote) {
    console.log('LoteList - Save');
    //const maxId = Math.max.apply(Math, lotes.map(function(el) { return el.id; }));
    //data.id = maxId + 1;
    //setLotes([...lotes, data]);
    const arrayLotes = [...lotes!, data]; 
    const arrayLotesOrder = sortArrayLotes(arrayLotes);
    //setLotes(arrayLotesOrder);
    setNewStateLotes(arrayLotesOrder);
    //storage.saveLotes(arrayLotesOrder);
  }

  function updateLote(data: Lote) {
    console.log('LoteList - Update');
    const newLotes = lotes!.filter(e => e.id !== data.id);
    //setLotes([...newLotes, data]);
    const arrayLotes = [...newLotes, data]; 
    const arrayLotesOrder = sortArrayLotes(arrayLotes);
    //setLotes(arrayLotesOrder);
    setNewStateLotes(arrayLotesOrder);
    //storage.saveLotes(arrayLotesOrder);
  }

  async function deleteLote(id: number) {
    console.log('LoteList - Delete');
    try {
      setSpinner(true);
      const response = await api.delete('lotes/' + id);
      setSpinner(false);
      if (response.status === 200) {
        const newLotes = lotes!.filter(lote => lote.id !== id);
        //setLotes(newLotes);
        setNewStateLotes(newLotes);
        //storage.saveLotes(newLotes);
        alert.alertOk('Lote Excluido!');
        //navigation.navigate('ProdutoList', { umProduto });
        return;
      } else {
        throw 'Erro ' + response.status + ' no acesso API';
      }
    } catch(err) {
      setSpinner(false);
      alert.alertErroOps(err);
      return;
    }  
  }

  function editLote(id: number) {
    console.log('LoteList - Edit ', id);
    const lote = lotes!.find( (e => e.id === id), id);
    console.log('LOTELIST', lote);
    navigation.navigate('LoteAdd', { lote: lote });
  }

  function goLoteAdd() {
    console.log('LoteList - goLoteAdd');
    // navigation.navigate('LoteAdd', { saveLote: saveLote, umLote: {} });
    navigation.navigate('LoteAdd', { umLote: {} });
    // Navegando para outra tela e passando uma função de callback para o retorno
    // this.props.navigation.navigate('LoteAdd', { saveLote: this.saveLote });
  }

  function goLoteShow(id: number) {
    console.log('LoteList - goLoteShow ', id);
    const lote = lotes!.find( (e => e.id === id), id);
    //console.log('LoteList', lote);
    navigation.navigate('LoteShow', { lote: lote });
  }

  return (
    <View style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <View style={styles.body}>
        {/* <AppSwipeable dados={ this.status.lotes} /> */}
        <FlatList data={lotes} 
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => 
            <LoteItem {...item} listaStringPedidos={getListaStringPedidos(item)}
              goLoteShow={() => goLoteShow(item.id as number)} 
              onEdit={editLote} 
              onDelete={() => deleteLote(item.id as number)} />  }
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goLoteAdd}
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

export default LoteList;