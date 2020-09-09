import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Platform, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
//import moment from 'moment';
//import 'moment/locale/pt-br';
import UsuarioItem from '../../components/usuarios/UsuarioItem';
//import UsuarioAdd from './UsuarioAdd';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../commonStyles';
import { Usuario } from 'src/interfaces/Usuario';
//import ActionButton from 'react-native-action-button';

//import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { useUsuario } from '../../contexts/usuarioContext';
import { AxiosResponse, AxiosError } from 'axios';

type ParamList = {
  UsuarioList: {
    umUsuario: Usuario;
    ehSearch: boolean;
    ehEdit: boolean;
  };
};

//export default function UsuarioList() {
const UsuarioList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'UsuarioList'>>();
  const { usuarios, setNewStateUsuarios } = useUsuario();
  //const [usuarios, setUsuarios] = useState([]);
  const [ehSearch, setEhSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('UsuarioList - useEffect INIT');
    //loadUsuarios();
  }, []);

  useEffect(() => {
    console.log('UsuarioList - Voltou UsuarioAdd');
    if (route.params?.umUsuario) {
      if (route.params?.ehEdit) {
        updateUsuario(route.params?.umUsuario);
      } else {
        saveUsuario(route.params?.umUsuario);
      }
    }
  }, [route.params?.umUsuario]);

  useEffect(() => {
    console.log('UsuarioList - useEffect search');
    if (route.params?.ehSearch) {
      setEhSearch(true);
    }
  }, [route.params?.ehSearch]);
  
  useEffect(() => {
    console.log('UsuarioList - useEffect usuarios');
  }, [usuarios]);

  // Para carregar os dados da API
  /* async function loadUsuarios() {
    if (loading) {
      return;
    }
    if (totalRow > 0 && usuarios.length == totalRow) {
      return;
    }
    setSpinner(true);
    const response = await api.get('usuarios', { params: { page } });
    setSpinner(false);
    setUsuarios([ ...usuarios, ...response.data]); // Esta anexando 2 array em 1
    setTotalRow(response.headers['x-total-count']);
    setPage(page + 1);
    setLoading(false);
  } */

  function sortArrayUsuarios(arrayUnsort: Usuario[]) {
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

  function saveUsuario(data: Usuario) {
    console.log('UsuarioList - Save', data);
    const arrayUsuarios = [...usuarios!, data]; 
    const arrayUsuariosOrder = sortArrayUsuarios(arrayUsuarios);
    setNewStateUsuarios(arrayUsuariosOrder);
  }

  function updateUsuario(data: Usuario) {
    console.log('UsuarioList - Update', data);
    const newUsuarios = usuarios!.filter(e => e.id !== data.id);
    //setUsuarios([...newUsuarios, data]);
    const arrayUsuarios = [...newUsuarios, data]; 
    const arrayUsuariosOrder = sortArrayUsuarios(arrayUsuarios);
    //setUsuarios(arrayUsuariosOrder);
    setNewStateUsuarios(arrayUsuariosOrder);
    //storage.saveUsuarios(arrayUsuariosOrder);
  }

  async function deleteUsuario(id: number) {
    console.log('UsuarioList - Delete ' + id);
    setSpinner(true);
    api.delete<AxiosResponse>('users/' + id)
      .then((response: AxiosResponse) => {
        setSpinner(false);
        if (response.status === 200) {
          const newUsuarios = usuarios!.filter(usuario => usuario.id !== id);
          //setUsuarios(newUsuarios);
          setNewStateUsuarios(newUsuarios);
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
        //alert.alertErroOps(err);
        Alert.alert('Erro', 'Falha na exclusão do Usuario! ' + err);
        return;
      })

    /* const response = await api.delete('users/' + id);
    if (response.status === 200) {
      const newUsuarios = usuarios!.filter(usuario => usuario.id !== id);
      setNewStateUsuarios(newUsuarios);
    } else {
      Alert.alert('Erro', 'Falha na exclusão do produto! Status: ' + response.status);
    } */
  }

  function editUsuario(id: number) {
    console.log('UsuarioList - Edit');
    const usuario = usuarios!.find( (e => e.id === id), id);
    navigation.navigate('UsuarioAdd', { usuario: usuario });
  }

  function searchUsuario(id: number) {
    console.log('UsuarioList - Search');
    const usuario = usuarios!.find( (e => e.id === id), id);
    navigation.navigate('PedidoAdd', { searchUsuario: usuario });
  }

  function goUsuarioAdd() {
    console.log('UsuarioList - goUsuarioAdd');
    navigation.navigate('UsuarioAdd', { });
    // Navegando para outra tela e passando uma função de callback para o retorno
    // this.props.navigation.navigate('UsuarioAdd', { saveUsuario: this.saveUsuario });
  }

  return (
    <View style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <View style={styles.body}>
        <FlatList 
          data={usuarios} 
          keyExtractor={item => `${item.id}`}
          //showsVerticalScrollIndicator={false}
          //onEndReached={loadUsuarios} // Funcao que é disparada quando usuário chega no final da lista
          //onEndReachedThreshold={0.2} // Quando usuário estiver 20% do final da lista carrega novos itens
          renderItem={({ item }) => 
            <UsuarioItem {...item} 
              onDelete={deleteUsuario} 
              onEdit={editUsuario} 
              onSearch={searchUsuario} 
              ehSearch={ehSearch} />
          } 
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => { goUsuarioAdd(); }}
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

export default UsuarioList;