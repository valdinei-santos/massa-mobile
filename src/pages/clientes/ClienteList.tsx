import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Platform, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../../commonStyles';
import { Cliente } from 'src/interfaces/Cliente';
import ClienteItem from '../../components/clientes/ClienteItem';
import ClienteAdd from './ClienteAdd';
//import ActionButton from 'react-native-action-button';
import * as storage from '../../services/storage';
import * as alert from '../../components/shared/AlertCustom';
import api from '../../services/api';
import { useCliente } from '../../contexts/clienteContext';

type ParamList = {
  ClienteList: {
    umCliente: Cliente;
    ehSearch: boolean;
    ehEdit: boolean;
  };
};

//export default function ClienteList() {
const ClienteList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ClienteList'>>();
  const { clientes, setNewStateClientes } = useCliente();
  //const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ehSearch, setEhSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('ClienteList - useEffect INIT');
    //loadClientesApi();
    //loadClientesStorage();
  }, []);

  useEffect(() => {
    console.log('ClienteList - useEffect Voltou ClienteAdd');
    if (route.params?.umCliente) {
      if (route.params?.ehEdit) {
        updateCliente(route.params?.umCliente);
      } else {
        saveCliente(route.params?.umCliente);
      }
    }
  }, [route.params?.umCliente]);

  useEffect(() => {
    console.log('ClienteList - useEffect search');
    if (route.params?.ehSearch) {
      setEhSearch(true);
      navigation.setOptions({title: 'Selecione cliente...'});
    }
  }, [route.params?.ehSearch]);

  useEffect(() => {
    console.log('ClienteList - useEffect clientes');
  }, [clientes]);

  /* async function loadClientesStorage() {
        setClientes(await storage.getClientes());
    } */

  // Para carregar os dados da API
  /* async function loadClientesApi() {
        console.log('ClienteList - loadClientes');
        if (loading) {
            return;
        }
        if (totalRow > 0 && clientes.length == totalRow) {
            return;
        }
        try {
            setSpinner(true);
            const response = await api.get('clientes', { params: { page } });
            setSpinner(false);
            setClientes([ ...clientes, ...response.data]); // Esta anexando 2 array em 1
            setTotalRow(response.headers['x-total-count']);
            //setPage(page + 1);
            setSpinner(false);
        } catch (err) {
            setSpinner(false);
            alert.alertErroOps(err);
        }
    } */

  function sortArrayClientes(arrayUnsort: Cliente[]) {
    // Para ordenar um campo só
    const arraySort = arrayUnsort.sort( (a, b) => { 
      let x = a.nome.toLowerCase();
      let y = b.nome.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
    return arraySort;
  }

  function saveCliente(data: Cliente) {
    console.log('ClienteList - Save', data);
    //const maxId = Math.max.apply(Math, clientes.map(function(el) { return el.id; }));
    //data.id = maxId + 1;
    //setClientes([...clientes, data]);
    const arrayClientes = [...clientes!, data]; 
    const arrayClientesOrder = sortArrayClientes(arrayClientes);
    //setClientes(arrayClientesOrder);
    setNewStateClientes(arrayClientesOrder);
    //storage.saveClientes(arrayClientesOrder);
  }

  function updateCliente(data: Cliente) {
    console.log('ClienteList - Update', data);
    const newClientes = clientes!.filter(e => e.id !== data.id);
    //setClientes([...newClientes, data]);
    const arrayClientes = [...newClientes, data]; 
    const arrayClientesOrder = sortArrayClientes(arrayClientes);
    //setClientes(arrayClientesOrder);
    setNewStateClientes(arrayClientesOrder);
    //storage.saveClientes(arrayClientesOrder);
  }

  async function deleteCliente(id: number) {
    console.log('ClienteList - Delete');
    const response = await api.delete('clientes/' + id);
    if (response.status === 200) {
      const newClientes = clientes!.filter(cliente => cliente.id !== id);
      //setClientes(newClientes);
      setNewStateClientes(newClientes);
      //storage.saveClientes(newClientes);
    } else {
      Alert.alert('Erro', 'Falha na exclusão do produto! Status: ' + response.status);
    }
  }

  function editCliente(id: number) {
    console.log('ClienteList - Edit');
    const cliente = clientes!.find( (e => e.id === id), id);
    navigation.navigate('ClienteAdd', { cliente: cliente });
  }

  function searchCliente(id: number) {
    console.log('ClienteList - Search');
    const cliente = clientes!.find( (e => e.id === id), id);
    navigation.navigate('PedidoAdd', { searchCliente: cliente });
  }

  function goClienteAdd() {
    console.log('ClienteList - goClienteAdd');
    navigation.navigate('ClienteAdd', { });
    // Navegando para outra tela e passando uma função de callback para o retorno
    // this.props.navigation.navigate('ClienteAdd', { saveCliente: this.saveCliente });
  }

  return (
    <View style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <View style={styles.body}>
        <FlatList 
          data={clientes} 
          keyExtractor={item => `${item.id}`}
          //showsVerticalScrollIndicator={false}
          //onEndReached={loadClientes} // Funcao que é disparada quando usuário chega no final da lista
          //onEndReachedThreshold={0.2} // Quando usuário estiver 20% do final da lista carrega novos itens
          renderItem={({ item }) => 
            <ClienteItem {...item} 
              onDelete={deleteCliente} 
              onEdit={editCliente} 
              onSearch={searchCliente} 
              ehSearch={ehSearch} />
          } 
        />
      </View>
      { !ehSearch && 
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => { goClienteAdd(); }}
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
  }
});

export default ClienteList;