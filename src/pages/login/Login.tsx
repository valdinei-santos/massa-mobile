import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/authContext';
import { useProduto } from '../../contexts/produtoContext';
import { useCliente } from '../../contexts/clienteContext';
import { usePedido } from '../../contexts/pedidoContext';
import { useLote } from '../../contexts/loteContext';
import { useUsuario } from '../../contexts/usuarioContext';

//import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
// @ts-ignore
import logoImg from '../../assets/logo-mao-na-massa.jpeg';
import * as Animatable from 'react-native-animatable';

import api from '../../services/api';
import * as storageUsuario from '../../services/storage-usuario';
import * as storage from '../../services/storage';
import * as alert from '../../components/shared/AlertCustom';
import { Cliente } from 'src/interfaces/Cliente';

//import Usuario from 'src/interfaces/Usuario';

let pkg = require('../../../package.json');


const Login: React.FC = () => {
  const { logado, signIn, user} = useAuth();
  const { loadDataProdutoApi } = useProduto();
  const { setNewStateClientes, loadDataClienteApi } = useCliente();
  const { loadDataPedidoApi } = usePedido();
  const { loadDataLoteApi } = useLote();
  const { loadDataUsuarioApi } = useUsuario();
  const navigation = useNavigation();
  const route = useRoute();
  const [showButton, setShowButton] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [spinner, setSpinner] = useState(false);
    
  useEffect(() => {
    console.log('Login useEffect []');
        
  }, []);

  useEffect(() => {
    onShowButton();
  }, [email, password ]);

  function onShowButton() {
    if ( (email !== '') && (password !== '') ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  async function loginUsuario() {
    console.log('loginUsuario');
    if (!email && !password) {
      alert.alertErro('Preencha todos os campos!!!');
      return;
    }
    try {
      //const response = await api.post('login', umUsuario);
      const response = await signIn(email, password);
      if (response) {
        if (response.status === 200) {
          console.log('LOGADO');
          await getAllDadosApi();
          navigation.navigate('Main', { umUsuario: user });
        } else {
          throw Error('Erro ' + response.status + ' no acesso API');
        }
      } else {
        throw Error('API não responde');
      }
    } catch(err) {
      //setSpinner(false);
      alert.alertErroOps('Erro no Login: ' + err);
      return;
    }
  }

  async function getAllDadosApi(): Promise<boolean> {
    try {
      /* let produtos;
            let clientes;
            let pedidos;
            let lotes; */
      setSpinner(true);
      const usuarioLogado = await storageUsuario.getUsuario();
      console.log('USUARIO LOGADO', usuarioLogado);
      loadDataProdutoApi();
      loadDataClienteApi(usuarioLogado.fl_admin === 1, usuarioLogado?.id);
      loadDataPedidoApi(usuarioLogado.fl_admin === 1, usuarioLogado?.id);
      loadDataLoteApi(usuarioLogado.fl_admin === 1);
      loadDataUsuarioApi(usuarioLogado.fl_admin === 1);

      //produtos = await api.get('produtos');
      //await storage.saveProdutos(produtos.data);
      //await insertUpdateProdutosRealm(produtos.data);

      /* if (usuarioLogado.admin === 1) {
                clientes = await api.get('clientes'); 
            } else {
                clientes = await api.get('clientes', { params: { user_id: user?.id } });
            } */
      //setNewStateClientes(clientes.data);
      //await storage.saveClientes(clientes.data);

      /* if (usuarioLogado.admin === 1) {
                pedidos = await api.get('pedidos');
            } else {
                pedidos = await api.get('pedidos', { params: { user_id: user?.id } });
            }
            await storage.savePedidos(pedidos.data); */

      /* if (usuarioLogado.admin === 1) {
                lotes = await api.get('lotes');
                storage.saveLotes(lotes.data);
            } */

      setSpinner(false);
      return true;
    } catch(err) {
      setSpinner(false);
      alert.alertErroOps('Erro na carga: ' + err);
      return false;
    }
  }


  return (
  // <KeyboardAvoidingView behavior={(Platform.OS === 'ios' ? 'padding' : 'height') } 
    <KeyboardAvoidingView behavior={(Platform.OS === 'ios' ? 'padding' : undefined ) } 
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={commonStyles.colors.maonamassa2} />    
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <Animatable.Image 
        animation="bounceInDown"
        style={{borderRadius: 110}} 
        source={logoImg} />
      <View style={styles.formContainer}>                
        <TextInput placeholder='Email' style={styles.nomeInput} 
          //selectionColor='#428AF8'
          placeholderTextColor='#428AF8'
          //underlineColorAndroid='#022695'
          autoCompleteType='email'
          keyboardType='email-address'
          autoFocus={true}
          // blurOnSubmit={false} // Para nao fechar o teclado
          onChangeText={email => setEmail(email.toLocaleLowerCase())}
          value={email} />
        <TextInput placeholder='Senha' style={styles.nomeInput} 
          placeholderTextColor='#428AF8'
          //underlineColorAndroid='#022695'
          autoCompleteType='password'
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
          value={password} />
        <View style={styles.viewButton}>
          <TouchableOpacity style={{ padding: 0 }} 
            disabled={!showButton} 
            onPress={() => loginUsuario()}>
            <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View> 
        <View style={styles.viewVersion}>
          <Text style={ {fontSize: 15} }>{pkg.version}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )

}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    //backgroundColor: "#F5FCFF",
    backgroundColor: commonStyles.colors.maonamassa2,
  },
  formContainer: {
    //backgroundColor: "#b3f2f2",
    padding: 20,
    width: '90%'
  },
  nomeInput: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '100%',
    height: 60,
    marginTop: 15,
    marginBottom: 15,
    //marginLeft: 10,
    paddingLeft: 15,
    fontSize: 25,
    backgroundColor: 'white',
    color: '#022695',
    //borderWidth: 1,
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 6,
    //borderBottomWidth: StyleSheet.hairlineWidth,
  },
  viewButton: {
    width: '100%',
    height: 55,
    marginBottom: 20,
  },
  button: {
    //backgroundColor: '#00F',
    backgroundColor: commonStyles.colors.maonamassa1,
    marginTop: 10,
    padding: 13,
    height: 60,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    //fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.maonamassa2,
    //color: '#FFF',
    fontSize: 25
  },
  viewVersion: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'green'
  }
    

});

export default Login;