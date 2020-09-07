import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Platform, FlatList, } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
//import moment from 'moment';
//import 'moment/locale/pt-br';
import ProdutoItem from '../../components/produtos/ProdutoItem';
//import ProdutoAdd from './ProdutoAdd';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../commonStyles';
//import ActionButton from 'react-native-action-button';

//import AsyncStorage from '@react-native-community/async-storage';
import * as storage from '../../services/storage';
import * as alert from '../../components/shared/AlertCustom';
import api from '../../services/api';
import { Produto } from 'src/interfaces/Produto';
//import { openRealm } from '../../services/realm';
import { alertErro } from '../../components/shared/AlertCustom';
import { useProduto } from '../../contexts/produtoContext';

type ParamList = {
  ProdutoList: {
    umProduto: Produto;
    ehSearch: boolean;
    ehEdit: boolean;
  };
};

//export default function ProdutoList() {
const ProdutoList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProdutoList'>>();
  const { produtos, setNewStateProdutos } = useProduto();
  //const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosReal, setProdutosRealm] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [ehSearch, setEhSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('ProdutoList - useEffect INIT');
    //loadProdutosApi();
    //loadProdutosStorage();
    //handleAddProduto();
    //pathRealmDB();
    //loadProdutosRealm();
  }, []);

  useEffect(() => {
    console.log('ProdutoList - useEffect search');
    if (route.params?.ehSearch) {
      setEhSearch(true);
      navigation.setOptions({title: 'Selecione produto...'});
    }
  }, [route.params?.ehSearch]);

  useEffect(() => {
    console.log('ProdutoList - Voltou ProdutoAdd');
    if (route.params?.umProduto) {
      if (route.params?.ehEdit) {
        updateProduto(route.params?.umProduto);
      } else {
        saveProduto(route.params?.umProduto);
      }
    }
  }, [route.params?.umProduto]);

  useEffect(() => {
    console.log('ProdutoList - useEffect produtos');
  }, [produtos]);

  /* async function loadProdutosStorage() {
        setProdutos(await storage.getProdutos());
    } */

  /* async function loadProdutosRealm() {
        console.log('getProdutosRealm');
        let produtos = await queryAllProdutosRealm();
        //console.log('Proddd', produtos);
        setProdutos(produtos);
    } */

  // Para carregar os dados da API
  //async function loadProdutos(event, newPage = null) {
  /* async function loadProdutosApi() {
        console.log('ProdutoList - loadProdutos');
        if (spinner) {
            return;
        }

        if (totalRow > 0 && produtos.length == totalRow) {
            console.log('ProdutoList - Chegou no total')
            return;
        }
        try {
            setSpinner(true);
            const response = await api.get('produtos', { params: { page } });
            setSpinner(false);
            setProdutos([ ...produtos, ...response.data]); // Esta anexando 2 array em 1
            console.log('X-Total-Count: ', response.headers['x-total-count'])
            setTotalRow(response.headers['x-total-count']);
            //setPage(page + 1);
            setSpinner(false);
        } catch (err) {
            setSpinner(false);
            alert.alertErroOps(err);
        }
    } */

  function sortArrayProduto(arrayUnsort: Produto[]) {
    // Para ordenar um campo só
    /* const arraySort = arrayUnsort.sort( (a, b) => { 
            let x = (a.nome + ' ' + a.sabor).toLowerCase();
            let y = (b.nome + ' ' + a.sabor).toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        }); */
    //return arraySort;

    // Para ordenar 2 campos.
    const arraySort = arrayUnsort.sort( (a, b) => {     
      var aNome = a.nome;
      var bNome = b.nome;
      var aSabor = a.sabor;
      var bSabor = b.sabor;
      return (aNome < bNome) ? -1 : (aNome > bNome) 
        ? 1 : ( (aSabor < bSabor ) 
          ? -1 : (aSabor > bSabor ) 
            ? 1 : 0 );
    });
    return arraySort;
  }

  function saveProduto(data: Produto) {
    console.log('ProdutoList - Save');
    //const maxId = Math.max.apply(Math, produtos.map(function(el) { return el.id; }));
    //data.id = maxId + 1;
    //data.preco_unidade = Number(data.preco_unidade.replace(',','.'));
    //setProdutos([...produtos, data]);
    const arrayProdutos = [...produtos!, data]; 
    const arrayProdutosOrder = sortArrayProduto(arrayProdutos);
    //setProdutos(arrayProdutosOrder);
    setNewStateProdutos(arrayProdutosOrder);
    //storage.saveProdutos(arrayProdutosOrder);
    //console.log('ProdutoList ORDER ', arrayProdutosOrder);
  }

  function updateProduto(data: Produto) {
    console.log('ProdutoList - Update');
    const newProdutos = produtos!.filter(e => e.id !== data.id);
    data.preco_unidade = Number(String(data.preco_unidade).replace(',','.'));
    const arrayProdutos = [...newProdutos, data];
    const arrayProdutosOrder = sortArrayProduto(arrayProdutos);
    //setProdutos(arrayProdutosOrder);
    setNewStateProdutos(arrayProdutosOrder);
    //storage.saveProdutos(arrayProdutosOrder);
  }

  function searchProduto(id: number) {
    console.log('ProdutoList - Search');
    const produto = produtos!.find( (e => e.id === id), id);
    console.log('PRODUTO QUE VAI', produto)
    navigation.navigate('PedidoAdd', { searchProduto: produto });
  }

  async function deleteProduto(id: number) {
    console.log('ProdutoList - Delete');
    setSpinner(true);
    const response = await api.delete('produtos/' + id);
    console.log(response.status);
    if (response.status === 200) {
      const newListaProdutos = produtos!.filter(e => e.id !== id);
      //setProdutos(newListaProdutos);
      setNewStateProdutos(newListaProdutos);
      setSpinner(false);
      //storage.saveProdutos(newListaProdutos);
    } else {
      Alert.alert('Erro', 'Falha na exclusão do produto! Status: ' + response.status);
      setSpinner(false);
      /* Alert.alert('Erro', 'Falha na exclusão do produto!', [
                {text: 'Ask me later', 
                    onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', 
                    onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                {text: 'OK', 
                    onPress: () => console.log('OK Pressed')
                },
            ], {cancelable: false}, ); */
    }
        
    //const newProdutos = produtos.filter(produto => produto.id !== id);
    //setProdutos(newProdutos);
  }

  function editProduto(id: number) {
    console.log('ProdutoList - Edit ', id);
    const produto = produtos!.find( (e => e.id === id), id);
    navigation.navigate('ProdutoAdd', { produto: produto });
  }

  function goProdutoAdd() {
    console.log('ProdutoList - goProdutoAdd');
    navigation.navigate('ProdutoAdd', { });
    // Navegando para outra tela e passando uma função de callback para o retorno
    // this.props.navigation.navigate('ProdutoAdd', { saveProduto: this.saveProduto });
  }

    
  return (
    <View style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <View style={styles.body}>
        <FlatList 
          data={produtos} 
          keyExtractor={item => `${item.id}`}
          //showsVerticalScrollIndicator={false}
          //onEndReached={loadProdutosStorage} // Funcao que é disparada quando usuário chega no final da lista
          //onEndReachedThreshold={0.1} // Quando usuário estiver 20% do final da lista carrega novos itens
          renderItem={({ item }) => 
            <ProdutoItem {...item} 
              onDelete={deleteProduto} 
              onEdit={editProduto} 
              onSearch={searchProduto} 
              ehSearch={ehSearch} />
          } 
        />
      </View>
      { !ehSearch && 
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => { goProdutoAdd(); }}
                  style={styles.TouchableOpacityStyle}>
                  <Icon name='plus' size={20} color={commonStyles.colors.white} />
                </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 0,
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
    marginLeft: 0,
    paddingLeft: 0,
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
  /* viewIndicator: {
        position: 'relative',
        width: width,
        height: height,
        paddingVertical: 20,
        borderTopWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        borderColor: colors.veryLightPink
    } */
});

export default ProdutoList;
